const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
const { AuthenticationError } = require('apollo-server-koa');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const ctx = args[2];
      // ctx.userId - in case of subscriptions
      const userId = ctx.state ? ctx.state.userId : ctx.userId;
      if (!userId) {
        ctx.throw(new AuthenticationError('Not authenticated'));
      }
      return resolve.call(this, ...args);
    };
  }
}

module.exports = {
  auth: AuthDirective,
};
