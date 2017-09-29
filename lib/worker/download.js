const logger = require('../logger')();
const rp = require('request-promise');
const path = require('path');
const fs = require('fs');

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

            await rp.get({
                uri: task.params.url,
                headers
            }).pipe(fs.createWriteStream(path.join(__dirname, '../../../download', task.params.path)));

            task.status = 'success';
        } catch (e) {
            task.status = 'failed';
            task.result = e.message;
        }
    },
    async success(task, tm) {
    },
    async failed(task, tm) {
        // 设置重试的次数限制
        let retry = task.retry || 1;
        if (retry >= 3) {
            // failed, do nothing
            // TODO: maybe try later
        } else {
            tm.addTask({
                type: 'download',
                retry: retry + 1,
                params: task.params
            });
        }
    }
};