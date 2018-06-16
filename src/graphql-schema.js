const path = require('path');
const { buildSchema } = require('graphql');
const { mergeTypes, fileLoader } = require('merge-graphql-schemas');

const typesArray = fileLoader(path.join(__dirname, 'api/**/*.graphql'));

const typeDefs = mergeTypes(typesArray, { all: true });

module.exports = buildSchema(typeDefs);
