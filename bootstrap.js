const taskManager = require('./lib/taskManager');

module.exports = async () => {
  await taskManager._load();
}
