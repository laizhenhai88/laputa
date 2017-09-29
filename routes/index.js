const router = require('koa-router')();
const tm = require('../lib/taskManager');

router.get('', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

router.post('instagram', async(ctx, next)=> {
    for (let i in ctx.request.body) {
        tm.addTask({
            type: 'instagram/account',
            params: {
                account: ctx.request.body[i]
            }
        });
    }
    ctx.body = {msg: 'success'}
});

router.post('babehub', async(ctx, next)=> {
    tm.addTask({
        type: 'babehub/list',
        params: {
            page: 1
        }
    });
    ctx.body = {msg: 'success'}
});

module.exports = router;