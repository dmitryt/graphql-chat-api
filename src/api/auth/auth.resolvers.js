const AuthService = require('../../services/auth');

const login = (_, { input: { username, password } }) => {
  return AuthService.login({ username, password });
};

module.exports = {
  Mutation: {
    login,
  },
};
