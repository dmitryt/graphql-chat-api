const { withFilter } = require('apollo-server-koa');

const Chat = require('../chat/chat.model');
const User = require('../user/user.model');
const pubsub = require('../../services/pubsub');

const MESSAGE_ADDED_SUBSCRIPTION = 'MESSAGE_ADDED_SUBSCRIPTION';

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
  pubsub.publish(MESSAGE_ADDED_SUBSCRIPTION, { messageAdded: message, sender: userId });
  return message;
};

// Subscriptions
const messageAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(MESSAGE_ADDED_SUBSCRIPTION),
    (payload = {}, variables, { userId }) => payload.sender !== userId,
  ),
};

module.exports = {
  Mutation: {
    addMessage,
  },
  Subscription: {
    messageAdded,
  },
};
