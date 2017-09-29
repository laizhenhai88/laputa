const rp = require('request-promise');
const request = require('request');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

let f = async() => {

    let html = '';

    try {
        let task = {};
        let $ = cheerio.load(html);
        task.result = [];

        console.log(task.result);
    } catch (e) {
        console.log(e)
        console.log("...............")
    }

}

f();