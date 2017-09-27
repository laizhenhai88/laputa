const logger = require('../logger')();

module.exports = {
    async doTask(task) {
        // do nothing
        task.result = 'copy';
        task.status = 'success';
    },
    async success(task, tm) {
        logger.info(task.msg);
        setTimeout(()=> {
            tm.addTask({
                type: 'greeting',
                msg: 'hello worker'
            });
        }, 3000);
    },
    async failed(task, tm) {
        // do nothing
    }
};