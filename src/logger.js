const winston = require('winston');

function getLogger() {
  return winston.createLogger({
    level: 'info',
    prettyPrint: true,
    colorize: true,
    timestamp: true,
    humanReadableUnhandledException: true,
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console(),
    ],
  });
}

module.exports = getLogger();
