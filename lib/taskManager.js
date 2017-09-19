const EventEmitter = require('events').EventEmitter;
const logger = require('./logger')(__filename);
const process = require('process');
const EventNamespace = require('./EventNamespace');
const mongo = require('./mongo');

const tm_added = Symbol();
const namespace = Symbol();

class TaskManager extends EventEmitter {
    constructor() {
        super();
        this.tasks = []; // 所有的任务
        this.workers = new Map(); // 处于空闲状态下的工人
        this.runningWorkers = new Map(); // 处于任务中的工人
    }

    addWorker(worker) {
        if (worker[tm_added]) {
            logger.error(`worker ${worker} already added`);
            return;
        }
        logger.debug(`add worker ${worker}`);
        worker[tm_added] = true;
        this.workers.set(worker.uuid, worker);

        // bind
        worker[namespace] = EventNamespace(worker);
        worker[namespace]('tm')
            .on('task success', (task) => {
                this._taskSuccess(worker, task);
            })
            .on('task failed', (task) => {
                this._taskFailed(worker, task);
            })
            .on('disconnect', () => {
                this._removeWorker(worker);
            });

        this._dispatchTask();
    }

    // 工人掉线,则删除,回滚任务
    _removeWorker(worker) {
        logger.debug(`remove worker ${worker}`);
        // 清理相关的listener
        worker[namespace]('tm').removeAllListeners();
        delete worker[namespace];
        delete worker[tm_added];

        this.workers.delete(worker.uuid);
        if (worker.task) {
            // 已经分配任务,则回滚任务
            this.tasks.push(worker.task);
            this.runningWorkers.delete(worker.uuid);
            this._dispatchTask();
        }
    }

    // 任务完成或失败时,需要释放一次继续做其它任务
    _releaseWorker(worker) {
        logger.debug(`release worker ${worker}`);
        delete worker.task;
        this.runningWorkers.delete(worker.uuid);
        this.workers.set(worker.uuid, worker);
        this._dispatchTask();
    }

    // 设置成async,调用方可wait,也可不wait;但是addTask内部实现必须全面await
    async addTask(task) {
        task.status = 'init';
        task.createTime = new Date();
        logger.debug(`add task ${JSON.stringify(task)}`);

        await mongo.persist(async(client)=> {
            await client.collection('task').insertOne(task);
            delete task.result;
            this.tasks.push(task);
            this._dispatchTask();
        });
    }

    _dispatchTask() {
        // 因为dispatch任务的emit task有可能是同步执行,所以为避免深度优先执行,采取nextTick方法
        process.nextTick(()=> {
            // 一旦有新资源加入，则触发任务分配
            if (this.tasks.length > 0 && this.workers.size > 0) {
                var worker = this.workers.values().next().value;
                worker.task = this.tasks.shift();
                // 开始下发给worker
                logger.debug(`dispatch worker ${worker} task:${JSON.stringify(worker.task)}`);
                worker.emit('task', worker.task);
                this.runningWorkers.set(worker.uuid, worker);
                this.workers.delete(worker.uuid);
            }

            this._state();
        });
    }

    async _taskSuccess(worker, task) {
        logger.debug(`worker ${worker} task success:${JSON.stringify(task)}`);

        await mongo.persist(async(client) => {
            // 执行任务模块回调,注意此处应为无事务性,所以允许任务重复,但不允许任务掉链子
            await require('./worker/' + task.type).success(task, this);
            // 持久化任务状态
            await client.collection('task').updateOne({_id: mongo.ObjectID(task._id)}, {
                $set: {
                    status: task.status,
                    result: task.result,
                    finishTime: new Date()
                }
            });
            this._releaseWorker(worker);
        });
    }

    async _taskFailed(worker, task) {
        logger.error(`worker ${worker} task failed:${JSON.stringify(task)}`);

        await mongo.persist(async(client) => {
            // 更新db中任务状态,记录log,预警
            task._id = mongo.ObjectID(task._id);
            await client.collection('task').updateOne({_id: task._id}, {
                $set: {
                    status: task.status,
                    result: task.result,
                    finishTime: new Date()
                }
            });
            // 任务是否重做,重做几次,都由逻辑模块自己控制
            await require('./worker/' + task.type).failed(task, this);
            // 释放
            this._releaseWorker(worker);
        });
    }

    _state() {
        logger.info(`state - task(${this.tasks.length}) sleepWorker(${this.workers.size}) running(${this.runningWorkers.size})`);
    }
}

class Worker extends EventEmitter {
    constructor(uuid, type) {
        super();
        this.uuid = uuid;
        this.type = type;
    }

    toString() {
        return `Worker(${this.uuid}/${this.type})`;
    }
}

module.exports = new TaskManager();
module.exports.Worker = Worker;