const taskManager = require('./lib/taskManager');

module.exports = async ()=>{
    setTimeout(()=> {
        // taskManager.addTask({
        //     type: 'greeting',
        //     msg: 'hello worker'
        // });
        taskManager.addTask({
            type: 'babehub/list',
            url: 'http://www.babehub.com/'
        });
    }, 3000);
}