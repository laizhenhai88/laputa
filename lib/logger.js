const path = require('path');
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: {type: 'console'},
        daily: {
            type: 'dateFile',
            filename: '../logs/',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['daily', 'out'], level: 'debug'}
    }
});

const dirname = path.join(__dirname, '../');

// Error
// at module.exports (/Users/laihongyu/WebstormProjects/laputa/lib/logger.js:22:11)
// at Object.<anonymous> (/Users/laihongyu/WebstormProjects/laputa/lib/mongo.js:4:35)
// at Module._compile (module.js:624:30)

module.exports = (cat) => {
    if (cat == undefined) {
        let s = {};
        Error.captureStackTrace(s);
        let m = s.stack.match(/\([^\)]+\)/g);
        cat = m[1].match(/[^:\(]+/g)[0];
    }
    // if __filename
    if (cat.startsWith(dirname)) {
        cat = cat.substring(dirname.length);
    }
    return log4js.getLogger(cat);
};