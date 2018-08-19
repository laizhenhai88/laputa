const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

module.exports = router;
