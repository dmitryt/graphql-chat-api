const { ObjectId } = require('mongoose').Types;
const { withFilter } = require('apollo-server-koa');

const Chat = require('./chat.model');
const User = require('../user/user.model');
const Message = require('../message/message.model');
const pubsub = require('../../services/pubsub');

const CHAT_ADDED_SUBSCRIPTION = 'CHAT_ADDED_SUBSCRIPTION';
const CHAT_REMOVED_SUBSCRIPTION = 'CHAT_REMOVED_SUBSCRIPTION';

const chats = (_, args, ctx) => {
  const { type, query } = args;
  const { userId } = ctx.state;
  let result = type === 'my' ? Chat.find({ creator: ObjectId(userId) }) : Chat.find({});
  if (query && query.length >= 3) {
    result = result.find({ title: { $regex: query, $options: 'i' } });
  }
  return result.exec();
};

const prepareUser = async (query, { ctx }) => {
  const { userId } = ctx.state;
  const instance = await query.populate('messages.sender').exec();
  instance.isChatMember = userId;
  instance.isChatCreator = userId;
  return instance;
};

const chat = async (_, { id }, ctx) => prepareUser(Chat.findById(id), { ctx });

const createChat = async (_, { input }, ctx) => {
  console.log('CREATE CHAT', ctx.state);
  const { userId } = ctx.state;
  const result = await Chat.create({ ...input, creator: userId, members: [userId] });
  pubsub.publish(CHAT_ADDED_SUBSCRIPTION, { chatAdded: result });
  return result;
};

const deleteChat = async (_, { id }) => {
  const result = await Chat.findByIdAndRemove(id).exec();
  pubsub.publish(CHAT_REMOVED_SUBSCRIPTION, { chatRemoved: id });
  return result;
};

const joinChat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const sender = await User.findById(userId);
  const content = 'has joined the chat successfully';
  return prepareUser(
    Chat.findByIdAndUpdate(id, {
      $addToSet: { members: userId },
      $push: { messages: new Message({ chatId: id, content, sender, isStatusMessage: true }) },
    }, { new: true }),
    { ctx },
  );
};

const leaveChat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const sender = await User.findById(userId);
  const content = 'has left the chat successfully';
  return prepareUser(
    Chat.findByIdAndUpdate(id, {
      $pull: { members: { $in: [userId] } },
      $push: { messages: new Message({ chatId: id, content, sender, isStatusMessage: true }) },
    }, { new: true }),
    { ctx },
  );
};

// Subscriptions
const chatAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(CHAT_ADDED_SUBSCRIPTION),
    (payload) => {
      console.log('FILTER', payload);
    },
  ),
};

const chatRemoved = {
  subscribe() {
    return pubsub.asyncIterator([CHAT_REMOVED_SUBSCRIPTION]);
  },
};

const creator = ({ creator: _id }) => ({ _id });

module.exports = {
  Query: {
    chats,
    chat,
  },
  Mutation: {
    createChat,
    deleteChat,
    joinChat,
    leaveChat,
  },
  Subscription: {
    chatAdded,
    chatRemoved,
  },
  Chat: {
    creator,
  },
};
