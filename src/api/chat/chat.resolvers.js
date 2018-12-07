const { ObjectId } = require('mongoose').Types;
const { withFilter } = require('apollo-server-koa');

const Chat = require('./chat.model');
const User = require('../user/user.model');
const Message = require('../message/message.model');
const pubsub = require('../../services/pubsub');

const CHAT_ADDED_SUBSCRIPTION = 'CHAT_ADDED_SUBSCRIPTION';
const CHAT_REMOVED_SUBSCRIPTION = 'CHAT_REMOVED_SUBSCRIPTION';
const MESSAGE_ADDED_SUBSCRIPTION = 'MESSAGE_ADDED_SUBSCRIPTION';

const chats = (_, args, ctx) => {
  const { type, query } = args;
  const { userId } = ctx.state;
  let result = type === 'my' ? Chat.find({ creator: ObjectId(userId) }) : Chat.find({});
  if (query) {
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
  const { userId } = ctx.state;
  const result = await Chat.create({ ...input, creator: userId, members: [userId] });
  pubsub.publish(CHAT_ADDED_SUBSCRIPTION, { chatAdded: result, sender: userId });
  return result;
};

const deleteChat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const result = await Chat.findByIdAndRemove(id).exec();
  pubsub.publish(CHAT_REMOVED_SUBSCRIPTION, { chatDeleted: id, sender: userId });
  return result;
};

const joinChat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const sender = await User.findById(userId);
  const content = 'has joined the chat successfully';
  const message = new Message({ chatId: id, content, sender, isStatusMessage: true });
  const result = await prepareUser(
    Chat.findByIdAndUpdate(id, {
      $addToSet: { members: userId },
      $push: { messages: message },
    }, { new: true }),
    { ctx },
  );
  const messageAdded = result.messages.find(m => String(m._id) === String(message._id));
  pubsub.publish(MESSAGE_ADDED_SUBSCRIPTION, { messageAdded, sender: userId });
  return result;
};

const leaveChat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const sender = await User.findById(userId);
  const content = 'has left the chat successfully';
  const message = new Message({ chatId: id, content, sender, isStatusMessage: true });
  const result = await prepareUser(
    Chat.findByIdAndUpdate(id, {
      $pull: { members: { $in: [userId] } },
      $push: { messages: message },
    }, { new: true }),
    { ctx },
  );
  const messageAdded = result.messages.find(m => String(m._id) === String(message._id));
  pubsub.publish(MESSAGE_ADDED_SUBSCRIPTION, { messageAdded, sender: userId });
  return result;
};

// Subscriptions
const chatAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(CHAT_ADDED_SUBSCRIPTION),
    (payload, variables, { userId }) => payload.sender !== userId,
  ),
};

const chatDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(CHAT_REMOVED_SUBSCRIPTION),
    (payload, variables, { userId }) => payload.sender !== userId,
  ),
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
    chatDeleted,
  },
  Chat: {
    creator,
  },
};
