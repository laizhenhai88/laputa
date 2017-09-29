const logger = require('../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../mongo');

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
                uri: `http://www.babehub.com/page/${task.params.page}/`,
                headers,
                gzip: true,
                resolveWithFullResponse: true
            });

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
            }

            let $ = cheerio.load(res.body);
            if ($('title').text() == '404 not found') {
                throw new Error('404');
            }

            // got li
            task.result = [];
            $('ul.gallery-d>li').each((i, ele)=> {
                let time = $('span.date', ele).text();
                $('span', ele).remove('span.date');
                task.result.push({
                    url: $('a', ele).prop('href'),
                    image: $('img', ele).prop('src'),
                    name: $('span', ele).text(),
                    type: $(ele).hasClass('vid') ? 'video' : 'image',
                    time: time
                });
            });
            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
        let needNextPage = true;
        // write bh_list
        await mongo.persist(async(client)=> {
            for (let i in task.result) {
                let result = await client.collection('hb_list').updateOne(
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
                        type: 'babehub/detail',
                        params: {
                            _id: result.upsertedId._id,
                            type: task.result[i].type,
                            url: task.result[i].url
                        }
                    });
                    // add cover download task
                    let sps = task.result[i].image.split('.');
                    await tm.addTask({
                        type: 'download',
                        params: {
                            url: task.result[i].image,
                            path: `${result.upsertedId._id}.${sps[sps.length - 1]}`
                        }
                    });
                }
                break;
            }

            // if (needNextPage) {
            //     await tm.addTask({
            //         type: 'babehub/list',
            //         params: {
            //             page: task.params.page + 1
            //         }
            //     });
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
                type: 'babehub/list',
                retry: retry + 1,
                params: task.params
            });
        }
    }
};