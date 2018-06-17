const Router = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const router = new Router();
const schema = require('../graphql');
const rootValue = require('../graphql/resolvers');

router.get('/graphql', graphqlKoa({ schema, rootValue }));
router.post('/graphql', koaBody(), graphqlKoa({ schema, rootValue }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
