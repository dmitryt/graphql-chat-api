const { buildSchema } = require('graphql');

const typeDefs = require('./types');

module.exports = buildSchema(typeDefs);
