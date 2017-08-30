const EventEmitter = require('events').EventEmitter;
const taskManager = require('../taskManager');

class SpiderManager extends EventEmitter {
    constructor() {
        super();
    }

    socketHandler(socket) {
        socket.toString = () => {
            return `Spider(${socket.uuid}/${socket.type})`;
        };

        taskManager.addWorker(socket);
    }
}

module.exports = new SpiderManager();