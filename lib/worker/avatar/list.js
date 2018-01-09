const logger = require('../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../mongo');

let serial = 0

module.exports = {
    // return true the task will be add to manager
    async beforeAddTask(task) {
        return true;
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
                uri: task.params.page,
                headers,
                gzip: true,
                resolveWithFullResponse: true
            });

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
            }

            let $ = cheerio.load(res.body);
            task.result = {
              images: [],
              next: 'http://www.woyaogexing.com' + $('div.listPage').children()[1].attribs.href
            };
            $('img.lazy').each((i, ele)=>{
              task.result.images.push($(ele).prop('src'))
            })
            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
      await tm.addTask({
          type: task.type,
          params: {
            page: task.result.next
          }
      });

      for (let i in task.result.images) {
        let sps = task.result.images[i].split('.');
        serial++
        await tm.addTask({
            type: 'download',
            params: {
                url: task.result.images[i],
                path: `avatar/${serial}.${sps[sps.length - 1]}`
            }
        });
      }
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
