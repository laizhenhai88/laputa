const EventEmitter = require('events').EventEmitter;
const tm = require('../taskManager');

class SpiderManager extends EventEmitter {
  constructor() {
    super();
    this.httpSpiders = new Map();
  }

  socketHandler(socket, data) {
    if (data.filter) {
      socket.filter = data.filter
    }
    socket.toString = () => {
      return `Spider(${socket.uuid}/${socket.type})`;
    };

    tm.addWorker(socket);
  }

  // for http spider
  httpLogin(uuid, filter) {
    if (!this.httpSpiders.has(uuid)) {
      let httpSpider = this._createHttpSpider(uuid, filter);
      this.httpSpiders.set(uuid, httpSpider);
      tm.addWorker(httpSpider);
    }
  }

  _createHttpSpider(uuid, filter) {
    let httpSpider = new EventEmitter();
    httpSpider.uuid = uuid;
    httpSpider.type = 'httpSpider';
    if (filter) {
      httpSpider.filter = filter
    }
    httpSpider.toString = () => {
      return `Spider(${uuid}/httpSpider)`;
    };
    httpSpider.on('task', (task) => {
      httpSpider.task = task;
    });

    return httpSpider
  }

  httpGetTask(uuid) {
    let httpSpider = this.httpSpiders.get(uuid);
    if (!httpSpider || !httpSpider.task) {
      return null;
    }

    return httpSpider.task;
  }

  httpTaskSuccess(uuid, task) {
    let httpSpider = this.httpSpiders.get(uuid);
    if (!httpSpider || !httpSpider.task) {
      return;
    }

    httpSpider.emit('task success', task);
    delete httpSpider.task;
  }

  httpTaskFailed(uuid, task) {
    let httpSpider = this.httpSpiders.get(uuid);
    if (!httpSpider || !httpSpider.task) {
      return;
    }

    httpSpider.emit('task failed', task);
    delete httpSpider.task;
  }

  httpTaskRelease(uuid) {
    let httpSpider = this.httpSpiders.get(uuid);
    if (!httpSpider) {
      return;
    }

    tm._removeWorker(httpSpider);
    this.httpSpiders.delete(uuid);
  }
}

module.exports = new SpiderManager();
