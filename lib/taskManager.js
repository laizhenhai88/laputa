const EventEmitter = require('events').EventEmitter;
const logger = require('./logger')();
const process = require('process');
const EventNamespace = require('./EventNamespace');
const mongo = require('./mongo');

const tm_added = Symbol();
const namespace = Symbol();

class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = []; // 所有的待分配任务
    this.delayTasks = new Map(); // 所有的延时任务
    this.workers = new Map(); // 处于空闲状态下的工人
    this.runningWorkers = new Map(); // 处于任务中的工人
    this.groups = new Map(); // 所有任务组
    this.pause = false;
    this.addTaskOut = 0;
  }

  runningTaskAnalyze() {
    let types = [];
    this.runningWorkers.forEach((worker) => {
      types.push(worker.task.type)
    })
    if (types.length == 0) {
      return '';
    }

    let count = 1,
      result = [];
    let r = types.sort().reduce((x, y) => {
      if (x == y) {
        count++
      } else {
        result.push(`${x}[${count}]`)
        count = 1
      }
      return y
    })
    result.push(`${r}[${count}]`)
    return result.join(' ');
  }

  taskAnalyze() {
    let types = [];
    this.tasks.forEach((task) => {
      types.push(task.type)
    })
    if (types.length == 0) {
      return '';
    }

    let count = 1,
      result = [];
    let r = types.reduceRight((x, y) => {
      if (x == y) {
        count++
      } else {
        result.push(`${x}[${count}]`)
        count = 1
      }
      return y
    })
    result.push(`${r}[${count}]`)
    return result.join(' ');
  }

  async _load() {
    await mongo.persist(async (client) => {
      let tasks = await client.collection('task').find({status: 'init'}).toArray();
      for (let i in tasks) {
        this._addTask(tasks[i]);
      }
    });
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
    worker[namespace]('tm').on('task success', (task) => {
      this._taskSuccess(worker, task);
    }).on('task failed', (task) => {
      this._taskFailed(worker, task);
    }).on('disconnect', () => {
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
      this.tasks.unshift(worker.task);
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

  async appendTask(task) {
    await this.addTask(task, false)
  }

  async prependTask(task) {
    await this.addTask(task, true)
  }

  // 设置成async,调用方可wait,也可不wait;但是addTask内部实现必须全面await
  // delay单位ms
  async addTask(task, prepend) {
    task.status = 'init';
    task.createTime = new Date();
    delete task.result;

    await mongo.persist(async (client) => {
      this.addTaskOut++;
      await client.collection('task').insertOne(task);
      this._addTask(task, prepend);
      this.addTaskOut--;
    });
  }

  _addTask(task, prepend) {
    let delay = task.delay || 0;
    // 根据创建时间，做一个时间加法
    let offsetDelay = task.createTime.getTime() + delay - new Date().getTime();
    delay = offsetDelay < 0
      ? 0
      : offsetDelay;
    this.delayTasks.set(task, delay);
    setTimeout(async () => {
      this.delayTasks.delete(task);
      let shouldAddTask = undefined;
      try {
        shouldAddTask = await require('./worker/' + task.type).beforeAddTask(task, this);
      } catch (e) {
        logger.error(`task ${JSON.stringify(task)} beforeAddTask error`, e);
      }
      if (!shouldAddTask) {
        logger.error(`should not add task ${JSON.stringify(task)}`);
        await mongo.persist(async (client) => {
          // 更新db中任务状态,记录log,预警
          task._id = mongo.ObjectID(task._id);
          await client.collection('task').updateOne({
            _id: task._id
          }, {
            $set: {
              status: 'failed',
              result: 'should not add task',
              finishTime: new Date()
            }
          });

          // 如果有任务组，则数量-1
          await this._taskGroupDecrease(task);
        });
        return
      }
      if (prepend) {
        this.tasks.push(task);
      } else {
        this.tasks.unshift(task);
      }
      this._dispatchTask();
    }, delay);

    this._taskGroupIncrease(task);
    logger.debug(`add task ${JSON.stringify(task)} - real delay ${delay}`);
  }

  _dispatchTask() {
    if (this.pause) {
      return
    }
    // 因为dispatch任务的emit task有可能是同步执行,所以为避免深度优先执行,采取nextTick方法
    process.nextTick(() => {
      // 一旦有新资源加入，则触发任务分配
      this.workers.forEach((worker) => {
        if (this.tasks.length > 0) {
          if (worker.filter) {
            let match = false
            for (let i=0;i<this.tasks.length;i++) {
              if (worker.filter.find((f)=>this.tasks[i].type.startsWith(f))) {
                // match
                let temp = this.tasks[i]
                this.tasks[i] = this.tasks[this.tasks.length -1]
                this.tasks[this.tasks.length -1] = temp
                match = true
                break
              }
            }
            if (!match) {
              return
            }
          }

          worker.task = this.tasks.pop();
          // 开始下发给worker
          logger.debug(`dispatch worker ${worker} task:${JSON.stringify(worker.task)}`);
          worker.emit('task', worker.task);
          this.runningWorkers.set(worker.uuid, worker);
          this.workers.delete(worker.uuid);
        }
      })

      this._state();
    });
  }

  async _taskSuccess(worker, task) {
    logger.debug(`worker ${worker} task success:${JSON.stringify(task)}`);

    this._releaseWorker(worker);
    await mongo.persist(async (client) => {
      try {
        // 执行任务模块回调,注意此处应为无事务性,所以允许任务重复,但不允许任务掉链子
        await require('./worker/' + task.type).success(task, this);
      } catch (e) {
        logger.error(`task ${JSON.stringify(task)} success callback error`, e);
        throw e;
      }
      // 持久化任务状态
      await client.collection('task').updateOne({
        _id: mongo.ObjectID(task._id)
      }, {
        $set: {
          status: task.status,
          // result: task.result,
          finishTime: new Date()
        }
      });

      // 如果有任务组，则数量-1
      await this._taskGroupDecrease(task);
    });
  }

  async _taskFailed(worker, task) {
    logger.error(`worker ${worker} task failed:${JSON.stringify(task)}`);

    this._releaseWorker(worker);
    await mongo.persist(async (client) => {
      try {
        // 任务是否重做,重做几次,都由逻辑模块自己控制
        await require('./worker/' + task.type).failed(task, this);
      } catch (e) {
        logger.error(`task ${JSON.stringify(task)} failed callback error`, e);
        throw e;
      }
      // 更新db中任务状态,记录log,预警
      task._id = mongo.ObjectID(task._id);
      await client.collection('task').updateOne({
        _id: task._id
      }, {
        $set: {
          status: task.status,
          result: task.result,
          finishTime: new Date()
        }
      });

      // 如果有任务组，则数量-1
      await this._taskGroupDecrease(task);
    });
  }

  async _taskGroupIncrease(task) {
    // 如果有任务组，则进行记录
    if (task.groups) {
      for (let i in task.groups) {
        let group = this.groups.get(task.groups[i].id);
        if (group) {
          group.count++;
        } else {
          this.groups.set(task.groups[i].id, {
            ...task.groups[i],
            count: 1,
            createTime: new Date()
          });
        }
      }
    }
  }

  async _taskGroupDecrease(task) {
    // 如果有任务组，则数量-1
    if (task.groups) {
      for (let i in task.groups) {
        let group = this.groups.get(task.groups[i].id);
        group.count--;
        if (group.count == 0) {
          // 任务组完成
          try {
            this.groups.delete(task.groups[i].id);
            await require('./worker/' + task.groups[i].done).group.done(group, this);
          } catch (e) {
            logger.error(`task ${JSON.stringify(task)} group done callback error`, e);
            throw e;
          }
        }
      }
    }
  }

  _state() {
    logger.info(`state - task(${this.tasks.length}) sleepWorker(${this.workers.size}) running(${this.runningWorkers.size}) delayTask(${this.delayTasks.size})`);
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
