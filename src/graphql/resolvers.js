const { merge } = require('lodash');

const chatResolvers = require('../api/chat/chat.resolvers');
const userResolvers = require('../api/user/user.resolvers');
const messageResolvers = require('../api/message/message.resolvers');
const authResolvers = require('../api/auth/auth.resolvers');

module.exports = merge(
  chatResolvers,
  userResolvers,
  messageResolvers,
  authResolvers,
);
