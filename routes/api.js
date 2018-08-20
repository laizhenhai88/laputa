const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');
const conf = require('../conf.json')
const ss = require('../ss.json')

router.get('monitor', async (ctx, next) => {
  ctx.body = {
    tasks: tm.tasks.length,
    delayTasks: tm.delayTasks.size,
    workers: tm.workers.size,
    runningWorkers: tm.runningWorkers.size,
    groups: tm.groups,
    pause: tm.pause,
    addTaskOut: tm.addTaskOut,
    runningTaskAnalyze: tm.runningTaskAnalyze(),
    delayTaskAnalyze: tm.delayTaskAnalyze(),
    taskAnalyze: tm.taskAnalyze()
  }
});

router.post('list', async (ctx, next) => {
  await mongo.persist(async(client)=>{
    let res = await client.collection('task').find(ctx.request.body.filters).sort({$natural: -1}).limit(30).toArray()
    ctx.body = {
      code: 1,
      message: 'success',
      data: res
    }
  })
})

router.get('delayTasks', async (ctx, next) => {
  let t = []
  tm.delayTasks.forEach((k, v) => {
    t.push(v)
  })
  ctx.body = t
});

router.post('runDelayTaskNow', async (ctx, next) => {
  tm.runDelayTaskNow(ctx.request.body._id)
  ctx.body = {
    msg: 'success',
    code: 1
  }
})

router.post('pause/toggle', async (ctx, next) => {
  tm.pause = !tm.pause;
  tm._dispatchTask();
  ctx.body = {
    msg: 'success',
    code: 1
  }
});

router.post('addTask', async (ctx, next) => {
  tm.addTask(ctx.request.body)
  ctx.body = {
    msg: 'success',
    code: 1
  }
});

router.get('ss', async (ctx, next) => {
  ctx.body = ss[Math.floor(Math.random() * 100000) % ss.length]
});

module.exports = router;
