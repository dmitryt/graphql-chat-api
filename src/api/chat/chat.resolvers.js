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

const newChat = (_, { input }) => Chat.create(input);
const deletedChat = (_, { id }) => Chat.findByIdAndRemove(id).exec();

const creator = ({ creator: id }) => ({ id });

module.exports = {
  Query: {
    chats,
    chat,
  },
  Mutation: {
    newChat,
    deletedChat,
  },
  Chat: {
    creator,
  },
};
