const rp = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require('../lib/logger')();
// const Nightmare = require('nightmare');
const iconv = require('iconv-lite');

// const nightmare = Nightmare({
//   show: true,
//   openDevTools: {
//     mode: 'detach'
//   },
//   switches: {
//     // 'proxy-server': '1.2.3.4:5678',
//     'ignore-certificate-errors': true
//   },
//   // goto和load的超时已经设置的情况下， 按理说wait超时只能是页面不对
//   waitTimeout: 2 * 10000,
//   pollInterval: 250,
//   gotoTimeout: 60 * 1000,
//   loadTimeout: 60 * 1000,
//   executionTimeout: 60 * 1000,
//   // 1s输入5个
//   typeInterval: 200,
//   webPreferences: {
//     images: true,
//     webSecurity: false,
//     allowRunningInsecureContent: true
//   }
// });

let f = async() => {

  let html = `

  `

  let $ = cheerio.load(html);
  $('div.TypeList>ul>li>a').each((i, ele)=>{
  })

  let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.8",
    "referer":"http://www.umei.cc"
  };

  rp.get({uri: 'http://i1.umei.cc/small/files/s7288.jpg', headers}).pipe(fs.createWriteStream('s.jpg'));

}

f();
