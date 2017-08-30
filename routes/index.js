const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

module.exports = router;