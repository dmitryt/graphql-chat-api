const { ObjectId } = require('mongoose').Types;
const Chat = require('./chat.model');
const User = require('../user/user.model');
const Message = require('../message/message.model');

const chats = (_, { type, filter }, ctx) => {
  const { userId } = ctx.state;
  let query = type === 'my' ? Chat.find({ creator: ObjectId(userId) }) : Chat.find({});
  if (filter && filter.length > 3) {
    query = query.find({ title: { $regex: filter, $options: 'i' } });
  }
  return query.exec();
};

const prepareUser = async (query, { ctx }) => {
  const { userId } = ctx.state;
  const instance = await query.populate('messages.sender').exec();
  instance.isChatMember = userId;
  instance.isChatCreator = userId;
  return instance;
};

const chat = async (_, { id }, ctx) => prepareUser(Chat.findById(id), { ctx });

const createChat = (_, { input }, ctx) => {
  const { userId } = ctx.state;
  return Chat.create({ ...input, creator: userId, members: [userId] });
};
const deleteChat = (_, { id }) => Chat.findByIdAndRemove(id).exec();

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
  Chat: {
    creator,
  },
};
