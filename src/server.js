
const Koa = require('koa');
const config = require('config');
const httpLogger = require('koa-logger');
const koaJwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const graphqlService = require('./services/graphql');
const logger = require('./logger');
const connectDatabase = require('./db');
const errorHandler = require('./middlewares/error');

const PORT = config.get('port');
const app = new Koa();
const publicPaths = ['/graphql'];
const secret = config.get('secret');

async function main() {
  try {
    const info = await connectDatabase(config.get('mongo'));
    logger.info(`Database connection has been established at ${info.host}:${info.port}`);
  } catch (error) {
    logger.error('[DB] Unable to connect to database', error);
    throw error;
  }
  app.use(cors());
  app.use(bodyParser());
  app.use(httpLogger());
  app.use(errorHandler());
  app.use(koaJwt({ secret }).unless({ path: publicPaths }));
  const server = graphqlService.init(app);

  const httpServer = app.listen({ port: PORT }, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    logger.info(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  });

  server.installSubscriptionHandlers(httpServer);
}

main();
