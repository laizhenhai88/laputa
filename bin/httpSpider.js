const process = require('process');
const logger = require('laputa-log').createLogger()
const rp = require('request-promise');
// const server = require('./server.json');
const uuidGen = require('uuid');
const io = require('socket.io-client');
// const url = server.url;
const url = 'http://127.0.0.1:8080';
const spider = {
    type: 'httpSpider',
    uuid: uuidGen.v4()
};

// 大的任务超时设置
let timeoutRef = undefined;

const _action = async()=> {
    await rp.post({
        uri: `${url}/spider/login`,
        body: spider,
        json: true
    });

    let res = await rp.post({
        uri: `${url}/spider/getTask`,
        body: spider,
        json: true
    });

    if (!res.task) {
        logger.info('no task');
        return;
    }

    let task = res.task;
    logger.info(`got task ${JSON.stringify(task)}`);

    // set timeout
    timeoutRef = setTimeout(()=> {
        logger.error(`task timeout ${JSON.stringify(task)}`);
        process.exit(0);
        // TODO:关于timeout时如何通知服务器,如何更好的让客户端释放资源又;必须不能让timeout的任务又重新发送结果;可以考虑给每个task分配一个流水号,标记每一次dispatch
    }, 5 * 60 * 1000);

    // do task
    await require('../lib/worker/' + task.type).doTask(task);
    if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = undefined;
    }

    if (task.status == 'success') {
        logger.info('task success');
        await rp.post({
            uri: `${url}/spider/taskSuccess`,
            body: {
                uuid: spider.uuid,
                task: task
            },
            json: true
        });
    } else {
        logger.info('task failed');
        await rp.post({
            uri: `${url}/spider/taskFailed`,
            body: {
                uuid: spider.uuid,
                task: task
            },
            json: true
        });
    }

    await rp.post({
        uri: `${url}/spider/taskRelease`,
        body: spider,
        json: true
    });
};

const taskRunLoop = async()=> {
    try {
        await _action();

        setTimeout(()=> {
            taskRunLoop();
        }, 5 * 1000);
    } catch (e) {
        try{
            logger.error('exit with error', e);
            await rp.post({
                uri: `${url}/spider/taskRelease`,
                body: spider,
                json: true
            });
        } finally {
            process.exit(0);
        }
    }
};

taskRunLoop();
