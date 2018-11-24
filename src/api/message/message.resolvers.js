const Chat = require('../chat/chat.model');
const User = require('../user/user.model');

const addMessage = async (_, { input }, ctx) => {
  const {
    chatId,
    content,
  } = input;
  const { userId } = ctx.state;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error(404);
  }
  const sender = await User.findById(userId);
  const message = chat.messages.create({ content, sender, chatId });
  chat.messages.push(message);
  await chat.save();
  return message;
};

module.exports = {
  Mutation: {
    addMessage,
  },
};
