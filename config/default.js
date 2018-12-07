module.exports = {
  port: process.env.PORT || 3002,
  secret: 'secretKey',
  tokenName: 'dcode-token',
  mongo: {
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 27017,
    dbName: process.env.DATABASE_NAME || 'dogecodes-gqlchat-app',
  },
};
