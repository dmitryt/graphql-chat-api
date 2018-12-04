const { ApolloServer, PubSub } = require('apollo-server-koa');
const config = require('config');
const jwt = require('jsonwebtoken');

const { typeDefs, resolvers, schemaDirectives } = require('../graphql');

const secret = config.get('secret');

function init(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    subscriptions: {
      onConnect: async ({ authToken }) => {
        const context = {};
        try {
          if (authToken) {
            const { userId } = await jwt.verify(authToken, secret);
            context.userId = userId;
          }
        } catch (e) {}
        return context;
      },
    },
    context: async ({ ctx }) => {
      console.log('OIOIOIOIOI', ctx.connection);
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
  server.installSubscriptionHandlers(app);
  return server;
}

module.exports = {
  init,
};
