const logger = require('../../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../../mongo');
const iconv = require('iconv-lite');

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
                uri: `http://yxpjw.me/zhainanshe/list_4_${task.params.page}.html`,
                headers,
                encoding: null,
                gzip: true,
                resolveWithFullResponse: true
            });

            if (res.statusCode == 302) {
                task.result = [];
                task.status = 'success';
                return;
            }

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
            }

            let $ = cheerio.load(iconv.decode(res.body, 'gb2312'));

            task.result = [];
            $('article').each((i, ele)=> {
                task.result.push({
                    type: 'zhainanshe',
                    title: $('h2>a', ele).prop('title'),
                    url: $('h2>a', ele).prop('href'),
                    time: $('p.time', ele).text(),
                    note: $('p.note', ele).text(),
                    image: $('img', ele).prop('src')
                })
            });
            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
        let needNextPage = true;
        // write fuli_list
        await mongo.persist(async(client)=> {
            for (let i in task.result) {
                let result = await client.collection('fuli_list').updateOne(
                    {url: task.result[i].url},
                    task.result[i],
                    {upsert: true}
                );
                if (result.upsertedCount == 0) {
                    needNextPage = false;
                    logger.error(`${task.result[i].name} ${task.result[i].time} already added`);
                } else {
                    // add detail task
                    await tm.addTask({
                        type: 'fuli/p2-zhainanshe/detail',
                        params: {
                            _id: result.upsertedId._id,
                            url: task.result[i].url,
                            page: 1
                        }
                    });
                    // add cover download task
                    let sps = task.result[i].image.split('.');
                    await tm.addTask({
                        type: 'download',
                        params: {
                            url: task.result[i].image,
                            path: `fuli/${result.upsertedId._id}.${sps[sps.length - 1]}`
                        }
                    });
                }
            }

            // if (needNextPage) {
            await tm.addTask({
                type: task.type,
                params: {
                    page: task.params.page + 1
                }
            });
            // }
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