const tm = require('./lib/taskManager');
const mongo = require('./lib/mongo')

module.exports = async () => {
  await tm._load();
}
