const logger = require('../../../logger')();
const rp = require('request-promise');
const cheerio = require('cheerio');
const mongo = require('../../../mongo');

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

            let uri = task.params.url;
            if (task.params.page > 1) {
                uri = uri.split('.')[0] + '_' + task.params.page + '.html';
            }

            let res = await rp.get({
                uri: `http://yxpjwnet.com${uri}`,
                headers,
                gzip: true,
                followRedirect: false,
                simple: false,
                resolveWithFullResponse: true
            });

            logger.info('status code:' + res.statusCode);

            if (res.statusCode == 302) {
                task.result = [];
                task.status = 'success';
                return;
            }

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
            }

            let $ = cheerio.load(res.body);
            task.result = [];
            $('article.article-content>p>img').each((i, ele)=> {
                task.result.push({
                    image: $(ele).prop('src')
                })
            });

            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
        // write fuli_detail
        await mongo.persist(async(client)=> {
            if (task.result.length > 0) {
                // next page
                await tm.prependTask({
                    type: task.type,
                    params: {
                        _id: task.params._id,
                        url: task.params.url,
                        page: task.params.page + 1
                    }
                });

                for (let i in task.result) {
                    task.result[i].parentID = new mongo.ObjectID(task.params._id);
                }
                let result = await client.collection('fuli_detail').insertMany(task.result);
                for (let i in result.ops) {
                    // image
                    let sps = result.ops[i].image.split('.');
                    await tm.prependTask({
                        type: 'download',
                        params: {
                            url: result.ops[i].image,
                            path: `fuli/${result.ops[i]._id}-image.${sps[sps.length - 1]}`,
                            // Referer: "http://yxpjwnet.com/"
                        }
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
