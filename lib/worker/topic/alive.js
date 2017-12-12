const logger = require('../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../mongo');
const Nightmare = require('nightmare');
const sleep = require('../../sleep');

const nightmare = Nightmare({
  // show: true,
  // openDevTools: {
  //   mode: 'detach'
  // },
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
  tenMin: 'hour'
}

// const DELAY = {
//   sec: 0,
//   min: 60*1000,
//   tenMin: 10*60*1000,
//   hour: 11*60*1000
// }

const DELAY = {
  sec: 0,
  min: 10*1000,
  tenMin: 10*1000,
  hour: 10*1000
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
      if (!/buluo.qq.com/.test(task.params.url)) {
        // 如果不是部落的，直接通过吧
        task.result = 'alive';
        task.status = 'success';
        return;
      }

      let url = await nightmare
      .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36')
      .viewport(1366, 677)
      .goto(task.params.url)
      .wait(10*1000)
      .url();

      logger.info(url);

      if (url.replace(/https?:/,'').replace(/\/$/,'') == task.params.url.replace(/https?:/,'').replace(/\/$/,'')) {
        let s2 = await nightmare
          .evaluate(()=>{
          // 查看，回复
          let s1 = document.querySelector('div.head-bottom').innerHTML.split('>');
          let s2 = [];
          for (let i in s1){
            if (s1[i].length > 0 && s1[i].indexOf('<') > 0) {
              s2.push(s1[i].substring(0, s1[i].indexOf('<')));
            }
          }

          // 赞
          let like = document.querySelector('div.btn-container>div').innerHTML;
          s2.push(like.substring(2,like.length-1));

          return s2;
        });
        task.result = {
          alive: true,
          read: s2[2],
          comment: s2[4],
          like: s2[5]
        };
      } else {
        task.result = 'dead';
      }

      task.status = 'success';
    } catch (e) {
      logger.error(e);
      task.status = 'failed';
      task.result = e.message;
    }

    await nightmare.goto('about:blank');
  },
  async success(task, tm) {
    await mongo.persist(async (client) => {
      if (task.result == 'dead') {
        // 帖子被删除
        await client.collection('topicUrl').updateOne(
            {url: task.params.url},
            {
              $set: {
                alive: false,
                deadTime: new Date()
              }
            }
        );
      } else {
        // 帖子存活
        task.result.aliveTime = new Date();
        await client.collection('topicUrl').updateOne(
            {url: task.params.url},
            {
              $set: task.result,
              $push: {
                history: task.result
              }
            }
        );

        if (task.params.time == 'hour') {
          // 进入每小时监控，持续24*2次
          task.params.hour++;
          if (task.params.hour > 24*2) {
            return;
          }
          task.delay = DELAY['hour']*task.params.hour + task.params.createTime - new Date().getTime();
          await tm.addTask({
            type: task.type,
            delay: task.delay,
            params: task.params
          });
        } else {
          task.delay = DELAY[TIME[task.params.time]] + task.params.createTime - new Date().getTime();
          task.params.time = TIME[task.params.time];
          task.params.hour = 1;
          await tm.addTask({
            type: task.type,
            delay: task.delay,
            params: task.params
          });
        }
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
