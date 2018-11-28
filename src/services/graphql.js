const { ApolloServer } = require('apollo-server-koa');
const config = require('config');
const jwt = require('jsonwebtoken');

const { typeDefs, resolvers, schemaDirectives } = require('../graphql');

const secret = config.get('secret');

function init(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: async ({ ctx }) => {
      try {
        const token = (ctx.headers.authorization || '').split(' ')[1];
        if (token) {
          const { userId } = await jwt.verify(token, secret);
          ctx.state.userId = userId;
        }
      } catch (e) {}
      return ctx;
    },
  });
  server.applyMiddleware({ app });
  return server;
}

module.exports = {
  init,
};
