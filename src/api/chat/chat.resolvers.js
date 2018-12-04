const { ObjectId } = require('mongoose').Types;
const Chat = require('./chat.model');
const User = require('../user/user.model');
const Message = require('../message/message.model');

const CHAT_ADDED = 'CHAT_ADDED';
const CHAT_REMOVED = 'CHAT_REMOVED';

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
  const { userId, pubsub } = ctx.state;
  const result = await Chat.create({ ...input, creator: userId, members: [userId] });
  pubsub.publish(CHAT_ADDED, { postAdded: result });
  return result;
};

const deleteChat = async (_, { id }) => {
  const result = await Chat.findByIdAndRemove(id).exec();
  pubsub.publish(CHAT_REMOVED, { chatRemoved: id });
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
const chatAdded = async (_, __, ctx) => {
  const { pubsub } = ctx.state;
  pubsub.asyncIterator([CHAT_ADDED]);
};

const chatRemoved = async (_, __, ctx) => {
  const { pubsub } = ctx.state;
  pubsub.asyncIterator([CHAT_REMOVED]);
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
