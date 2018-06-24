const { merge } = require('lodash');

const chatResolvers = require('../api/chat/chat.resolvers');

module.exports = merge(chatResolvers);
