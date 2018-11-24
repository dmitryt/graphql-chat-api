const { ObjectId } = require('mongoose').Types;
const Chat = require('./chat.model');

const chats = (_, { type, filter }, ctx) => {
  const { userId } = ctx.state;
  let query = type === 'my' ? Chat.find({ creator: ObjectId(userId) }) : Chat.find({});
  if (filter && filter.length > 3) {
    query = query.find({ title: { $regex: filter, $options: 'i' } });
  }
  return query.exec();
};
const chat = async (_, { id }, ctx) => {
  const { userId } = ctx.state;
  const instance = await Chat
    .findById(id)
    .populate('messages.sender')
    .exec();
  instance.isChatMember = userId;
  instance.isChatCreator = userId;
  return instance;
};

const createChat = (_, { input }, ctx) => {
  const { userId } = ctx.state;
  return Chat.create({ ...input, creator: userId });
};
const deleteChat = (_, { id }) => Chat.findByIdAndRemove(id).exec();

const joinChat = (_, { id }, ctx) => {
  const { userId } = ctx.state;
  return Chat.findByIdAndUpdate(id, { $addToSet: { members: userId } }, { new: true }).exec();
};

const leaveChat = (_, { id }, ctx) => {
  const { userId } = ctx.state;
  return Chat.findByIdAndUpdate(id, { $pull: { members: { $eq: userId } } }, { new: true }).exec();
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
