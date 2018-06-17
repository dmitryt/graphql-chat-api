const path = require('path');
const { mergeTypes, fileLoader } = require('merge-graphql-schemas');

const typesArray = fileLoader(path.join(__dirname, '../api/**/*.graphql'));

module.exports = mergeTypes(typesArray, { all: true });
