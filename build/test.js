const rp = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const logger = require('../lib/logger')();

let f = async() => {

    let html =
        `
        
        `;
    try {
        let task = {};
        let $ = cheerio.load(html);
        task.result = [];

        console.log(task.result);
    } catch (e) {
        logger.error('itiseeee', e);
        console.log("...............")
    }

}

f();