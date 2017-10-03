const taskManager = require('./lib/taskManager');

module.exports = async()=> {
    await taskManager._load();

    setTimeout(()=> {
        // taskManager.addTask({
        //     type: 'greeting',
        //     params: {
        //         msg: 'hello worker'
        //     }
        // });

        taskManager.addTask({
            type: 'fuli/p1-zhaifuli/list',
            params: {
                page: 1
            }
        });
    }, 1000);
}