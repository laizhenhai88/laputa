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
    }, 3000);
}