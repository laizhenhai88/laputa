const logger = require('../logger')();

module.exports = {
    async beforeAddTask(task) {
        return true;
    },
    async doTask(task) {
        // do nothing
        task.result = 'copy';
        task.status = 'success';
    },
    async success(task, tm) {
        logger.info(task.params.msg);
        setTimeout(()=> {
            tm.addTask({
                type: 'greeting',
                params: {
                    msg: 'hello worker'
                }
            });
        }, 3000);
    },
    async failed(task, tm) {
        // do nothing
    }
};