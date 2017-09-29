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
                uri: task.params.url,
                headers,
                gzip: true,
                resolveWithFullResponse: true
            });

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
            }

            let $ = cheerio.load(res.body);
            if (task.params.type == 'image') {
                task.result = [];
                $('ul.gallery-e>li>a').each((i, ele)=> {
                    task.result.push({
                        type: 'image',
                        image: $(ele).prop('href'),
                        smallImage: $('img', ele).prop('src')
                    });
                });
            } else if (task.params.type == 'video') {
                task.result = {
                    'poster': $('video').prop('poster'),
                    'video': $('video>source').prop('src')
                }
            }

            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
        // write bh_detail
        await mongo.persist(async(client)=> {
            if (task.params.type == 'image') {
                for (let i in task.result) {
                    task.result[i].parentID = new mongo.ObjectID(task.params._id);
                }
                let result = await client.collection('hb_detail').insertMany(task.result);
                for (let i in result.ops) {
                    // image
                    let sps = result.ops[i].image.split('.');
                    await tm.addTask({
                        type: 'download',
                        params: {
                            url: result.ops[i].image,
                            path: `${result.ops[i]._id}-image.${sps[sps.length - 1]}`
                        }
                    });
                    // smallImage
                    sps = result.ops[i].smallImage.split('.');
                    await tm.addTask({
                        type: 'download',
                        params: {
                            url: result.ops[i].smallImage,
                            path: `${result.ops[i]._id}-smallImage.${sps[sps.length - 1]}`
                        }
                    });
                }
            } else if (task.params.type == 'video') {
                task.result.parentID = new mongo.ObjectID(task.params._id);
                let result = await client.collection('hb_detail').insertOne(task.result);
                // poster
                let sps = task.result.poster.split('.');
                await tm.addTask({
                    type: 'download',
                    params: {
                        url: task.result.poster,
                        path: `${result.insertedId}-poster.${sps[sps.length - 1]}`
                    }
                });
                // video
                sps = task.result.video.split('.');
                await tm.addTask({
                    type: 'download',
                    params: {
                        url: task.result.video,
                        path: `${result.insertedId}-video.${sps[sps.length - 1]}`
                    }
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
                type: 'babehub/detail',
                retry: retry + 1,
                params: task.params
            });
        }
    }
};