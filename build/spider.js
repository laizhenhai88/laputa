const process = require('process');
const logger = require('../lib/logger')(__filename);
// const server = require('./server.json');
const uuidGen = require('uuid');
const io = require('socket.io-client');
// const url = server.url;
const url = 'http://127.0.0.1:8080';
const socket = io.connect(url);

socket.uuid = uuidGen.v4();
socket.type = 'spider';

socket.on('connect', () => {
    logger.info(`login ${socket.uuid}/${socket.type}`);
    socket.emit('login', {
        uuid: socket.uuid,
        type: socket.type
    });
});

socket.on('disconnect', function () {
    logger.info('disconnect');
    process.exit(0);
});

socket.on('login', (result)=> {
    logger.info(`login ${result}`)
});

// TODO:大的任务超时设置
let currentTaskRunning = false;
socket.on('task', (task)=> {
    logger.info(`got task ${JSON.stringify(task)}`);
    if (currentTaskRunning) {
        logger.error('task repeat');
        return;
    }
    currentTaskRunning = true;
    doTask(task);
});

let doTask = async(task) => {
    await require('../lib/worker/' + task.type).doTask(task);
    currentTaskRunning = false;
    if (task.result == 'success') {
        logger.info('task success');
        socket.emit('task success', task);
    } else {
        logger.info('task failed');
        socket.emit('task failed', task);
    }
};