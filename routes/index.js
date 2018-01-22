const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');
const request = require('request');
const rp = require('request-promise');

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

router.get('monitor', async(ctx, next)=> {
  ctx.body = {
    tasks: tm.tasks.length,
    delayTasks: tm.delayTasks.size,
    workers: tm.workers.size,
    runningWorkers: tm.runningWorkers.size,
    groups: tm.groups
  }
});

router.post('addTask', async(ctx, next)=> {
  tm.addTask(ctx.request.body)
  ctx.body = {
    msg: 'success',
    code: 1
  }
});

module.exports = router;
