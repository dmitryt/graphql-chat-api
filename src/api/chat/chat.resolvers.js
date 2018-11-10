const { ObjectId } = require('mongoose').Types;
const Chat = require('./chat.model');

const chats = (_, { type, filter }) => {
  let query = type === 'my' ? Chat.find({ creator: ObjectId('5b2d5572b3270266e0db55ec') }) : Chat.find({});
  if (filter && filter.length > 3) {
    query = query.find({ title: { $regex: filter, $options: 'i' } });
  }
  return query.exec();
};
const chat = ({ id }) => Chat.findById(id).exec();

const createChat = (_, { input }) => Chat.create({ ...input, creator: ObjectId('5b2d5572b3270266e0db55ec') });
const deleteChat = (_, { id }) => Chat.findByIdAndRemove(id).exec();

const creator = ({ creator: _id }) => ({ _id });

module.exports = {
  Query: {
    chats,
    chat,
  },
  Mutation: {
    createChat,
    deleteChat,
  },
  Chat: {
    creator,
  },
};
