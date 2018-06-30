
const Koa = require('koa');
const config = require('config');
const httpLogger = require('koa-logger');
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');

const router = require('./routes');
const logger = require('./logger');
const connectDatabase = require('./db');
const errorHandler = require('./middlewares/error');

const PORT = config.get('port');
const app = new Koa();
const publicPaths = ['/login', '/register'];
const secret = config.get('secret');

async function main() {
  try {
    const info = await connectDatabase(config.get('mongo'));
    logger.info(`Database connection has been established at ${info.host}:${info.port}`);
  } catch (error) {
    logger.error('[DB] Unable to connect to database', error);
    throw error;
  }

  app.use(bodyParser());
  app.use(httpLogger());
  app.use(errorHandler());
  app.use(jwt({ secret }).unless({ path: publicPaths }));
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(PORT);
  logger.info(`Server is listening at ${PORT}`);
}

main();
