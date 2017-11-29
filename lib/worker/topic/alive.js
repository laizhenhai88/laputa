const logger = require('../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../mongo');
const Nightmare = require('nightmare');

const nightmare = Nightmare({
  show: true,
  openDevTools: {
    mode: 'detach'
  },
  switches: {
    // 'proxy-server': '1.2.3.4:5678',
    'ignore-certificate-errors': true
  },
  // goto和load的超时已经设置的情况下， 按理说wait超时只能是页面不对
  waitTimeout: 20 * 1000,
  pollInterval: 250,
  gotoTimeout: 60 * 1000,
  loadTimeout: 60 * 1000,
  executionTimeout: 60 * 1000,
  // 1s输入5个
  typeInterval: 200,
  webPreferences: {
    images: true,
    webSecurity: false,
    allowRunningInsecureContent: true
  }
});

const TIME = {
  sec: 'min',
  min: 'tenMin',
  tenMin: 'hour',
  hour: 'day'
}

// const DELAY = {
//   sec: 0,
//   min: 60*1000,
//   tenMin: 10*60*1000,
//   hour: 60*60*1000,
//   day: 24*60*60*1000
// }

const DELAY = {
  sec: 0,
  min: 1000,
  tenMin: 1000,
  hour: 1000,
  day: 0
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
      let url = await nightmare
      .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
      .viewport(1366, 677)
      .goto(task.params.url)
      .wait(10*1000)
      .url();

      logger.info(url);

      await nightmare.goto('about:blank');

      if (url == task.params.url) {
        task.result = 'alive';
      } else {
        task.result = 'dead';
      }

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
