const EventEmitter = require('events').EventEmitter;
const logger = require('../logger')(__filename);

class LoginManager extends EventEmitter {
    constructor() {
        super();
    }

    socketHandler(socket) {
        // 所有的连接都必须通过login manager进行校验后再分配
        socket.on('login', (data) => {
            socket.uuid = data.uuid;
            socket.type = data.type;

            logger.debug(`socket ${data.uuid}/${data.type} login success`);
            socket.emit('login', 'success');

            // if type is spider, then spiderManager will be require
            require(`./${socket.type}Manager`).socketHandler(socket);

            // can't login again
            socket.removeAllListeners('login');
        });

        socket.on('disconnect', () => {
            // do nothing
            logger.debug(`socket ${socket.uuid}/${socket.type} disconnect`);
        });
    }
}

module.exports = new LoginManager();