const path = require('path');
const fs = require('fs');
const axios = require('axios')
const Agent = require('socks5-http-client/lib/Agent')
const AgentS = require('socks5-https-client/lib/Agent')
const startSSLocal = require('shadowsocks-single').startSSLocal
const ss = require('../../ss.json')

module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    let p = path.dirname(path.resolve(path.join(__dirname, '../../../download', task.params.path))).split('/')
    let dir = '/'
    p.forEach((v) => {
      dir = path.join(dir, v)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    })
    // 此处全局控制了，是否用ss去下载资源（例如图片、视频等）
    return true;
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    try {
      let server = null

      try {
        let headers = {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-CN,zh;q=0.8"
        };

        if (task.params.Referer) {
          headers.Referer = task.params.Referer;
        }

        let ssServerProps = null

        try {
          ssServerProps = await startSSLocal({
            proxyOptions: ss[Math.floor(Math.random() * 100000) % ss.length]
          })
        } catch (e) {
          process.exit(0)
        }

        let port = ssServerProps.port
        server = ssServerProps.server

        await new Promise((resolve, reject) => {
          let outputStream = fs.createWriteStream(path.join(__dirname, '../../../download', task.params.path));

          axios.get(task.params.url, {
            timeout: task.timeout ? task.timeout : 30 * 1000,
            headers,
            httpAgent: new Agent({socksPort: port}),
            httpsAgent: new AgentS({socksPort: port}),
            responseType: 'stream'
          }).then((response) => {
            response.data.pipe(outputStream)
          }).catch(reject);

          outputStream.on('finish', resolve).on('error', reject)
        });

        task.status = 'success';
      } finally {
        server.close()
      }
    } catch (e) {
      task.status = 'failed';
      task.result = e.message;
    }
  },
  async success(task, tm) {},
  async failed(task, tm) {
    // 设置重试的次数限制
    let retry = task.retry || 1;
    if (retry >= 3) {
      // failed, do nothing
      // TODO: maybe try later
    } else {
      tm.addTask({
        type: task.type,
        timeout: task.timeout,
        retry: retry + 1,
        params: task.params
      });
    }
  }
};
