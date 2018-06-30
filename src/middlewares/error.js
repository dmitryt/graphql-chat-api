const logger = require('../logger');

async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    const message = err.message || 'Unhandled error';
    logger.error(message);
    ctx.status = err.status || 400;
    ctx.body = {
      type: 'error',
      message,
    };
    ctx.app.emit('error', err, ctx);
  }
}

module.exports = () => errorHandler;
