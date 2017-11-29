const logger = require('../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../mongo');

const TIME = {
  sec: 'min',
  min: 'tenMin',
  tenMin: 'hour',
  hour: 'day'
}

const DELAY = {
  sec: 0,
  min: 60*1000,
  tenMin: 10*60*1000,
  hour: 60*60*1000,
  day: 24*60*60*1000
}

module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    if (task.params.time != 'sec' || task.retry) {
      return true;
    }
    return await mongo.persist(async (client) => {
      let result = await client.collection('topicUrl').updateOne(
        {url: task.params.url},
        {url: task.params.url, alive: false, createTime: new Date()},
        {upsert: true}
      );
      if (result.upsertedCount == 0) {
        return false;
      }
      return true;
    });
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    try {
      let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.8",
      };

      let res = await rp.get({
        uri: task.params.url,
        headers,
        timeout: 30*1000,
        resolveWithFullResponse: true
      });

      if (res.statusCode != 200) {
        throw new Error(`error status code ${res.statusCode}`);
      }
      task.result = 'alive';

      task.status = 'success';
    } catch (e) {
      task.status = 'failed';
      task.result = e.message;
    }
  },
  async success(task, tm) {
    await mongo.persist(async (client) => {
      let setObj = {alive: task.result == 'alive'};
      setObj[task.params.time] = task.result == 'alive';
      await client.collection('topicUrl').updateOne(
          {url: task.params.url},
          {$set: setObj}
      );
      if (task.params.time != 'day' && task.result == 'alive') {
        task.delay = DELAY[TIME[task.params.time]] - DELAY[task.params.time];
        task.params.time = TIME[task.params.time];
        await tm.addTask({
          type: task.type,
          delay: task.delay,
          params: task.params
        });
      }
    });
  },
  async failed(task, tm) {
    // 设置重试的次数限制
    let retry = task.retry || 1;
    if (retry >= 3) {
      // failed, do nothing
      // TODO: maybe try later
    } else {
      tm.addTask({
        type: task.type,
        retry: retry + 1,
        params: task.params
      });
    }
  }
};
