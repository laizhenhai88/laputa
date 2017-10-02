const router = require('koa-router')();
const sm = require('../lib/socket/spiderManager');

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello http spider!';
});

router.post('login', async(ctx, next)=> {
    sm.httpLogin(ctx.request.body.uuid);
    ctx.body = {msg: 'success'}
});

router.post('getTask', async(ctx, next)=> {
    ctx.body = {
        task: sm.httpGetTask(ctx.request.body.uuid),
        msg: 'success'
    }
});

router.post('taskSuccess', async(ctx, next)=> {
    sm.httpTaskSuccess(ctx.request.body.uuid, ctx.request.body.task);
    ctx.body = {
        msg: 'success'
    }
});

router.post('taskFailed', async(ctx, next)=> {
    sm.httpTaskFailed(ctx.request.body.uuid, ctx.request.body.task);
    ctx.body = {
        msg: 'success'
    }
});

router.post('taskRelease', async(ctx, next)=> {
    sm.httpTaskRelease(ctx.request.body.uuid);
    ctx.body = {
        msg: 'success'
    }
});

module.exports = router;