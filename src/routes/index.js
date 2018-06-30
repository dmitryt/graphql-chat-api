const Router = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const router = new Router();
const schema = require('../graphql');
const auth = require('../services/auth');
// const rootValue = require('../graphql/resolvers');

router.get('/graphql', graphqlKoa({ schema }));
router.post('/graphql', koaBody(), graphqlKoa({ schema }));

router.post('/login', auth.login);
router.post('/register', auth.register);

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

module.exports = router;
