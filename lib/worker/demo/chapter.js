const path = require('path');
const fs = require('fs');
const axios = require('axios')
const mongo = require('../../mongo');

module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    // await mongo.persist(async (client) => {
    //   await client.collection('demo').insertOne({type: 'chapter'});
    // });
    return true;
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    task.status = 'success'
    task.result = 'done'
  },
  async success(task, tm) {
    for (let i = 0; i < 20; i++) {
      tm.addTask({type: 'demo/detail', groups: task.groups, params: {}})
    }
  },
  async failed(task, tm) {
    // 设置重试的次数限制
    let retry = task.retry || 1;
    if (retry >= 3) {
      // failed, do nothing
      // TODO: maybe try later
    } else {
      tm.addTask({
        ...task,
        retry: retry + 1
      });
    }
  },
  async done(task, tm) {
    await mongo.persist(async (client) => {
      await client.collection('demo').insertOne({type: 'chapter-done'});
    });
  }
};