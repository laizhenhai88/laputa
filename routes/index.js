const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');
const request = require('request');
const rp = require('request-promise');

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

router.get('proxy', async(ctx, next)=> {
    delete ctx.headers.referer;
    delete ctx.headers.host;
    ctx.respond = false;
    await rp.get({
        uri: ctx.query.target,
        headers: ctx.headers,
        encoding: null
    }).pipe(ctx.res);
    ctx.body = null;
});

router.get('monitor', async(ctx, next)=> {
  ctx.body = {
    tasks: tm.tasks.length,
    delayTasks: tm.delayTasks.size,
    workers: tm.workers.size,
    runningWorkers: tm.runningWorkers.size
  }
});

router.post('addTask', async(ctx, next)=> {
  tm.addTask(ctx.request.body)
  ctx.body = {
    msg: 'success'
  }
});

module.exports = router;
