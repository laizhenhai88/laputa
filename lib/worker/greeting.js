const logger = require('../logger')();

module.exports = {
    async doTask(task) {
        // do nothing
        task.status = 'success';
    },
    async success(task, tm) {
        logger.info(task.msg);
        setTimeout(()=> {
            taskManager.addTask(task);
        }, 3000);
    },
    async failed(task, tm) {
        // do nothing
    }
};