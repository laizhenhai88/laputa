const logger = require('../../logger')(__filename);
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    // set task.status 'success' or 'failed'
    // only task.result will persist to db, even though task failed
    async doTask(task) {
        try {
            let res = await rp.get({
                uri: `http://www.babehub.com/page/${task.params.page}/`,
                resolveWithFullResponse: true
            });
            let $ = cheerio.load(res.body);

            if ($('title').text() == '404 not found') {
                throw new Error('404');
            }

            if (res.statusCode != 200) {
                throw new Error(`error status code ${res.statusCode}`);
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
        tm.addTask({
            type: 'babehub/list',
            params: {
                page: task.params.page + 1
            }
        });
    },
    async failed(task, tm) {
        // 设置重试的次数限制
        let retry = task.params.retry || 1;
        if (retry >= 3) {
            // failed, do nothing
            // TODO: maybe try later
        } else {
            tm.addTask({
                type: 'babehub/list',
                params: {
                    retry: retry + 1,
                    page: task.params.page
                }
            });
        }
    }
};