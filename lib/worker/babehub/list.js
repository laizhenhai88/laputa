const logger = require('../../logger')(__filename);

module.exports = {
    // set task.status 'success' or 'failed'
    // only task.result will persist to db, even though task failed
    async doTask(task) {
        // do nothing
        task.status = 'success';
        task.result = 'many pics';
        // task.status = 'failed';
        // task.result = 'fuck the GWF';
    },
    async success(task, tm) {
        logger.info('spider success callback');
        // setTimeout(()=> {
        //     taskManager.addTask(task);
        // }, 3000);
    },
    async failed(task, tm) {
        logger.info('spider failed callback');
    }
};