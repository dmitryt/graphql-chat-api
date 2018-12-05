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
    subscriptions: {
      onConnect: async ({ authToken }) => {
        const context = {};
        try {
          if (authToken) {
            const { userId } = await jwt.verify(authToken, secret);
            context.userId = userId;
          }
        } catch (e) {
          console.error(e);
        }
        console.log('onConnect', context);
        return context;
      },
    },
    context: async ({ ctx, connection }) => {
      if (connection) {
        // check connection for metadata
        console.log('context', connection.context);
        return connection.context;
      }
      try {
        const token = (ctx.headers.authorization || '').split(' ')[1];
        if (token) {
          const { userId } = await jwt.verify(token, secret);
          console.log('HERE THERE', ctx.state);
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
