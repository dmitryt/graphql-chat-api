const util = require('util');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../api/user/user.model');

const secret = config.get('secret');

async function login({ username, password }) {
  if (!username || !password) {
    return Promise.reject(new Error('Username or password is not provided'));
  }
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return Promise.reject(new Error('Username or password is incorrect'));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return Promise.reject(new Error('Username or password is incorrect'));
  }
  return util.promisify(jwt.sign)({ userId: user._id }, secret, { expiresIn: '1h' });
}

module.exports = {
  login,
};
