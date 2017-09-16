const taskManager = require('./lib/taskManager');

module.exports = async()=> {
    setTimeout(()=> {
        // taskManager.addTask({
        //     type: 'greeting',
        //     msg: 'hello worker'
        // });
        taskManager.addTask({
            type: 'babehub/list',
            params: {
                page: 1
            }
        });
    }, 3000);
}