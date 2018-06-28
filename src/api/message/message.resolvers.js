const Chat = require('../chat/chat.model');
const User = require('../user/user.model');

const newMessage = async (_, { input }) => {
  try {
    const {
      chatId,
      senderId,
      content,
      statusMessage,
    } = input;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error(404);
    }
    const sender = await User.findById(senderId);
    const message = chat.messages.create({ content, sender, statusMessage });
    chat.messages.push(message);
    await chat.save();
    return message;
  } catch (e) {
    return e;
  }
};

module.exports = {
  Mutation: {
    newMessage,
  },
};
