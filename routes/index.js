const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');
const request = require('request');
const rp = require('request-promise');

router.get('/', async(ctx, next) => {
    ctx.body = 'Hello laputa!';
});

router.get('tm/monitor', async(ctx, next)=> {
  ctx.body = {
    tasks: tm.tasks.length,
    delayTasks: tm.delayTasks.size,
    workers: tm.workers.size,
    runningWorkers: tm.runningWorkers.size,
    groups: tm.groups,
    pause: tm.pause
  }
});

router.post('tm/pause/toggle', async(ctx, next)=> {
  tm.pause = !tm.pause;
  tm._dispatchTask();
  ctx.body = {
    msg: 'success',
    code: 1
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
