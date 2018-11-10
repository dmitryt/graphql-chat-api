const path = require('path');

const { readTextFile } = require('../util');
const resolvers = require('./resolvers');

const readTypes = paths => paths.map(p => readTextFile(path.resolve(__dirname, p)));

const typeDefs = readTypes([
  './base.graphql',
  '../api/chat/chat.graphql',
  '../api/message/message.graphql',
  '../api/user/user.graphql',
  '../api/auth/auth.graphql',
]);

module.exports = {
  typeDefs,
  resolvers,
};
