const User = require('./user.model');

const currentUser = (_, __, ctx) => User.findById(ctx.state.userId).exec();

const signup = async (_, { username, password }) => {
  const users = await User.find({ username }).exec();
  if (users.length > 0) {
    return Promise.reject(new Error('User with such username already exists'));
  }
  return User.create({ username, password });
};

const updateUser = (_, { firstName, lastName }, ctx) =>
  User.findByIdAndUpdate(ctx.state.userId, { firstName, lastName }, { new: true }).exec();

module.exports = {
  Query: {
    currentUser,
  },
  Mutation: {
    signup,
    updateUser,
  },
};
