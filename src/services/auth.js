const util = require('util');
const config = require('config');
const jwt = require('jsonwebtoken');

const logger = require('../logger');
const User = require('../api/user/user.model');

const secret = config.get('secret');

async function login(ctx) {
	const { username, password } = ctx.request.body;
	const throwValidationError = () => {
		throw new Error('Username or password is incorrect');
	};
  if (!username || !password) {
    throw new Error('Username or password is not provided');
  }
  const user = await User.findOne({ username }).exec();
  if (!user) {
    throwValidationError();
  }
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		throwValidationError();
	}
	const token = await util.promisify(jwt.sign)({ userId: user._id }, secret, { expiresIn: '1h' });
	ctx.body = { token };
}

async function register(ctx) {
  const { username, password } = ctx.request.body;
  logger.info(`[API] Register with username "${username}"`);

  const users = await User.find({ username }).exec();
  if (users.length > 0) {
    throw new Error('User with such username already exists');
  }
  const user = await User.create({ username, password });
  ctx.body = user;
}

module.exports = {
  login,
  register,
};
