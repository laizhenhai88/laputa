const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');

router.get('/', async(ctx, next) => {
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
            page: ctx.request.body.page
        }
    });
    ctx.body = {msg: 'success'}
});

router.get('monitor', async(ctx, next)=> {
    await mongo.persist(async(client)=> {
        ctx.body = {
            task: await client.collection('task').count(),
            waiting: await client.collection('task').count({status: 'init'}),
            hb_list: await client.collection('fuli_list').count(),
            hb_detail: await client.collection('fuli_detail').count(),
        }
    });
});

module.exports = router;