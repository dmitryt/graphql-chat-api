const User = require('./user.model');

const getMe = (_, { id }) => User.findById(id).exec();

const signup = async (_, { username, password }) => {
  const users = await User.find({ username }).exec();
  if (users.length > 0) {
    return Promise.reject(new Error('User with such username already exists'));
  }
  return User.create({ username, password });
};

const updateUser = (_, { id, input }) => User.findByIdAndUpdate(id, input);

module.exports = {
  Query: {
    getMe,
  },
  Mutation: {
    signup,
    updateUser,
  },
};
