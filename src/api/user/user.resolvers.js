const User = require('./user.model');

const getMe = ({ id }) => User.findById(id).exec();

// const newUser = ({ input }) => User.create(input);
// const updatedUser = ({ id, input }) => User.findByIdAndUpdate(id, input);

module.exports = {
  // Query
  // User: getMe,

  // Mutation
  // newUser,
  // updatedUser,
};

module.exports = {
  Query: {
    getMe,
  },
};
