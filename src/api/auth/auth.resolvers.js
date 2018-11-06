const AuthService = require('../../services/auth');

const login = (_, { input: { username, password } }) => AuthService.login({ username, password });

module.exports = {
  Mutation: {
    login,
  },
};
