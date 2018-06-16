
const Koa = require('koa');
const config = require('config');

const router = require('./routes');

const PORT = config.get('PORT');
const app = new Koa();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
