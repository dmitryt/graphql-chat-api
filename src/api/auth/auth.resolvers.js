const AuthService = require('../../services/auth');

const login = async (_, { username, password }, ctx, info) => {
  try {
    const result = await AuthService.login({ username, password });
    if (!result.token) {
      throw new Error('Cannot generate the token');
    }
    console.log('WOWOWOWOW', ctx);
    ctx.response.cookie('dcode-token', result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1h
    });
    return { success: true };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  Mutation: {
    login,
  },
};
