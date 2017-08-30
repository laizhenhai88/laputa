const taskManager = require('./lib/taskManager');

module.exports = async ()=>{
    setTimeout(()=> {
        taskManager.addTask({
            type: 'greeting',
            msg: 'hello worker'
        });
    }, 3000);
}