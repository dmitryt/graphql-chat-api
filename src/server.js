
const Koa = require('koa');
const config = require('config');
const httpLogger = require('koa-logger');
const koaJwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const graphqlService = require('./services/graphql');
const logger = require('./logger');
const connectDatabase = require('./db');
const errorHandler = require('./middlewares/error');

const PORT = config.get('port');
const app = new Koa();
const publicPaths = ['/login', '/register', '/graphiql', '/graphql'];
const secret = config.get('secret');

async function main() {
  try {
    const info = await connectDatabase(config.get('mongo'));
    logger.info(`Database connection has been established at ${info.host}:${info.port}`);
  } catch (error) {
    logger.error('[DB] Unable to connect to database', error);
    throw error;
  }
  app.use(async (ctx, next) => {
    try {
      const token = (ctx.headers.authorization || '').split(' ')[1];
      if (token) {
        const { userId } = await jwt.verify(token, secret);
        ctx.state.userId = userId;
      }
    } catch (e) {

    }
    await next();
  });
  app.use(cors());
  app.use(bodyParser());
  app.use(httpLogger());
  app.use(errorHandler());
  app.use(koaJwt({ secret }).unless({ path: publicPaths }));

  const server = graphqlService.init(app);

  app.listen({ port: PORT }, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

main();
