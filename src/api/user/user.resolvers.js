const User = require('./user.model');

const getMe = (_, { id }) => User.findById(id).exec();

const newUser = (_, { input }) => User.create(input);

const updatedUser = (_, { id, input }) => User.findByIdAndUpdate(id, input);

module.exports = {
  Query: {
    getMe,
  },
  Mutation: {
    newUser,
    updatedUser,
  },
};
