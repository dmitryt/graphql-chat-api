const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
module.exports = ({ host, port, user, password, dbName }, logger) => {
  const credentials = user ? `${user}:${password}@` : '';
  const uri = `mongodb://${credentials}${host}:${port}/${dbName}`;
  return new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => logger.info('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(uri);
  });
};
