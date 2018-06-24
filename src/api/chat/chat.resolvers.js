const Chat = require('./chat.model');

const allChats = () => Chat.find({}).exec();
const getChat = ({ id }) => Chat.findById(id).exec();

const newChat = ({ input }) => Chat.create(input);

const creator = ({ creator: id }) => ({ id });

module.exports = {
  Query: {
    allChats,
  },
  Mutation: {
    Chat: getChat,
    newChat,
  },
  Chat: {
    creator,
  },
};
