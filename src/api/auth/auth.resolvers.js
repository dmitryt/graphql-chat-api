const AuthService = require('../../services/auth');

const login = async (_, { username, password }) => {
  try {
    const token = await AuthService.login({ username, password });
    if (!token) {
      throw new Error('Cannot generate the token');
    }
    return { token };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  Mutation: {
    login,
  },
};
