const Router = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const router = new Router();
const schema = require('../graphql');
const api = require('../api/auth');
// const rootValue = require('../graphql/resolvers');

router.get('/graphql', graphqlKoa({ schema }));
router.post('/graphql', koaBody(), graphqlKoa({ schema }));

router.post('/login', api.login);
router.post('/register', api.register);

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
