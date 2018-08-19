const path = require('path');
const cp = require('child_process');
const exec = cp.exec;
const sleep = require('../lib/sleep')
const logger = require('laputa-log').createLogger()

const run = async () => {
  try {
    let count = 1
    while(true) {
      logger.info('spider master start ' + count)
      // 开始启动任务
      await new Promise((resolve, reject) => {
        const worker = cp.fork('./bin/spider.js')
        worker.on('exit', ()=>{
          resolve()
        })
      })
      logger.info('spider worker dead')
      count ++
    }
  } catch (e) {
    process.exit(0)
  }
}

run()
