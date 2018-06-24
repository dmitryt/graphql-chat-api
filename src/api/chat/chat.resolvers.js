const Chat = require('./chat.model');

const allChats = () => Chat.find({}).exec();
const chat = ({ id }) => Chat.findById(id).exec();

const newChat = (_, { input }) => Chat.create(input);
const deletedChat = (_, { id }) => Chat.findByIdAndRemove(id).exec();

const creator = ({ creator: id }) => ({ id });

module.exports = {
  Query: {
    allChats,
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
