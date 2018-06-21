const Message = require('./message.model');

const newMessage = ({ input }) => Message.create(input);

module.exports = {
  // Mutation
  newMessage,
};
