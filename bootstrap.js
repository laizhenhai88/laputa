const taskManager = require('./lib/taskManager');

module.exports = async () => {
  await taskManager._load();

  setTimeout(() => {
    // taskManager.addTask({
    //     type: 'greeting',
    //     delay: 10 * 60 * 1000,
    //     params: {
    //         msg: 'hello worker'
    //     }
    // });

    // taskManager.addTask({
    //     type: 'avatar/list',
    //     params: {
    //         page: 'http://www.woyaogexing.com/touxiang/katong/2018/567500.html'
    //     }
    // });
  }, 1000);
}
