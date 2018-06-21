const Chat = require('./chat.model');

const allChats = () => Chat.find({}).exec();
const getChat = ({ id }) => Chat.findById(id).exec();

const newChat = ({ input }) => Chat.create(input);

module.exports = {
  // Query
  allChats,
  Chat: getChat,

  // Mutation
  newChat,
};
