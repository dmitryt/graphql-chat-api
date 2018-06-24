const { makeExecutableSchema } = require('graphql-tools');

const Chat = require('../api/chat/chat.graphql');
const resolvers = require('./resolvers');

const baseSchema = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [baseSchema, Chat],
  resolvers,
});
