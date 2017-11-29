const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');

router.post('/', async (ctx, next) => {
  let urls = ctx.request.body.urls.split('\n');
  await mongo.persist(async (client) => {
    await client.collection('topic').updateOne(
      {group: ctx.request.body.group},
      {
        $set: {
          group : ctx.request.body.group,
          createTime: new Date()
        },
        $addToSet: {urls: {$each: urls}}
      },
      {upsert: true}
    );
    for (let i in urls) {
      await tm.addTask({
        type: 'topic/alive',
        params: {
          url: urls[i],
          time: 'sec'
        }
      });
    }
    ctx.body = {
      msg: 'success',
      code: 1
    }
  });
});

router.get('/', async (ctx, next) => {
  await mongo.persist(async (client) => {
    ctx.body = await client.collection('topic').find().sort({
      'createTime': -1
    }).limit(20).toArray();
  });
});

router.get('detail/:_id', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let group = await client.collection('topic').findOne({_id:mongo.ObjectID(ctx.params._id)});
    group.detail = [];
    for (let i in group.urls) {
      group.detail.push(
        await client.collection('topicUrl').findOne({url: group.urls[i]})
      );
    }
    ctx.body = group;
  });
});

router.get('detail/group/:group', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let group = await client.collection('topic').findOne({group:ctx.params.group});
    if (!group) {
      ctx.body = {};
      return;
    }
    group.detail = [];
    for (let i in group.urls) {
      group.detail.push(
        await client.collection('topicUrl').findOne({url: group.urls[i]})
      );
    }
    ctx.body = group;
  });
});

module.exports = router;
