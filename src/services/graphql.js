const { ApolloServer } = require('apollo-server-koa');
const { typeDefs, resolvers } = require('../graphql');

function init(app) {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });
  return server;
}

module.exports = {
  init,
};
