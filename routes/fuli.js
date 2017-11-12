const router = require('koa-router')();
const mongo = require('../lib/mongo');

router.get(':page', async (ctx, next) => {
  await mongo.persist(async (client) => {
    ctx.body = await client.collection('fuli_list').find(
      {detail: true}
    ).sort({
      'time': -1
    }).skip((ctx.params.page - 1) * 20).limit(20).toArray();
  });
});

router.get('detail/:_id', async (ctx, next) => {
  console.log(ctx.params._id);
  await mongo.persist(async (client) => {
    detail = {};
    detail.main = await client.collection('fuli_list').findOne({_id:mongo.ObjectID(ctx.params._id)});
    detail.items = await client.collection('fuli_detail').find({parentID:mongo.ObjectID(ctx.params._id)}).toArray();
    ctx.body = detail;
  });
});

module.exports = router;
