const genericPool = require('generic-pool');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('./logger')();
const conf = require('../conf.json');

// const url = 'mongodb://192.168.7.252:27017/laputa';
// const url = 'mongodb://localhost:27017/laputa';

const factory = {
    create() {
        return MongoClient.connect(conf.mongoUrl);
    },
    destroy(client) {
        client.close();
    }
};

const opts = {
    max: 20,
    min: 20,
    fifo: true,
    idleTimeoutMillis: 30000
};

const pool = genericPool.createPool(factory, opts);
pool.ObjectID = ObjectID;

pool.persist = async(task)=> {
    let result = undefined;
    try {
        let client = await pool.acquire();
        // 连接池fifo,每个连接仅持有50ms,则1s内能获取20次,池中20个连接的话,就能1s产生400并发,基本够用
        setTimeout(()=> {
            pool.release(client);
        }, 50);
        result = await task(client.db(conf.db));
    } catch (e) {
        logger.error(e);
        throw e;
    }
    return result;
};

module.exports = pool;
