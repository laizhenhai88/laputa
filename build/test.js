const rp = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require('../lib/logger')();
const Nightmare = require('nightmare');

const nightmare = Nightmare({
  show: true,
  openDevTools: {
    mode: 'detach'
  },
  switches: {
    // 'proxy-server': '1.2.3.4:5678',
    'ignore-certificate-errors': true
  },
  // goto和load的超时已经设置的情况下， 按理说wait超时只能是页面不对
  waitTimeout: 2 * 10000,
  pollInterval: 250,
  gotoTimeout: 60 * 1000,
  loadTimeout: 60 * 1000,
  executionTimeout: 60 * 1000,
  // 1s输入5个
  typeInterval: 200,
  webPreferences: {
    images: true,
    webSecurity: false,
    allowRunningInsecureContent: true
  }
});

let f = async() => {

logger.info('xx')
  let a = await nightmare
  .goto('https://buluo.qq.com/p/detail.html?bid=395783&pid=1025675-1511852523')
  .wait(5000)
  .url()
  logger.info(a)

    // let html =
    //     `
    //
    //     `;
    // try {
    //     let task = {};
    //     let $ = cheerio.load(html);
    //     task.result = [];
    //
    //     console.log(task.result);
    // } catch (e) {
    //     logger.error('itiseeee', e);
    //     console.log("...............")
    // }

}

f();
