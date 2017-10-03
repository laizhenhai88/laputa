const process = require('process');
const logger = require('../lib/logger')();
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

// 大的任务超时设置
let timeoutRef = undefined;
let currentTaskRunning = false;
socket.on('task', (task)=> {
    logger.info(`got task ${JSON.stringify(task)}`);
    if (currentTaskRunning) {
        logger.error('task repeat');
        return;
    }
    currentTaskRunning = true;

    // set timeout
    timeoutRef = setTimeout(()=> {
        logger.error(`task timeout ${JSON.stringify(task)}`);
        process.exit(0);
        // TODO:关于timeout时如何通知服务器,如何更好的让客户端释放资源又;必须不能让timeout的任务又重新发送结果;可以考虑给每个task分配一个流水号,标记每一次dispatch
    }, 1 * 60 * 1000);

    doTask(task);
});

let doTask = async(task) => {
    await require('../lib/worker/' + task.type).doTask(task);
    currentTaskRunning = false;
    if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = undefined;
    }

    if (task.status == 'success') {
        logger.info('task success');
        socket.emit('task success', task);
    } else {
        logger.info('task failed');
        socket.emit('task failed', task);
    }
};