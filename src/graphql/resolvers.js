const path = require('path');
const { mergeResolvers, fileLoader } = require('merge-graphql-schemas');

const resolversArray = fileLoader(path.join(__dirname, '../api/**/*.resolvers.js'));

module.exports = mergeResolvers(resolversArray);
