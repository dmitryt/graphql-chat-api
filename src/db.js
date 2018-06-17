const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
module.exports = ({ host, port, dbName }, logger) => {
  const uri = `mongodb://${host}:${port}/${dbName}`;
  return new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => logger.info('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(uri);
  });
};
