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

module.exports = (cat) => {
    // if __filename
    if (cat.startsWith(dirname)) {
        cat = cat.substring(dirname.length);
    }
    return log4js.getLogger(cat);
};