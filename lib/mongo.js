const genericPool = require('generic-pool');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('./logger')(__filename);

const url = 'mongodb://localhost:27017/laputa';

const factory = {
    create() {
        return MongoClient.connect(url);
    },
    destroy(client) {
        client.close();
    }
};

const opts = {
    max: 10,
    min: 10,
    fifo: true,
    idleTimeoutMillis: 30000
};

const pool = genericPool.createPool(factory, opts);
pool.ObjectID = ObjectID;

pool.persist = async(task)=> {
    try {
        let client = await pool.acquire();
        // 连接池fifo,每个连接仅持有50ms,则1s内能获取20次,池中10个连接的话,就能1s产生200并发,基本够用
        setTimeout(()=> {
            pool.release(client);
        }, 50);
        await task(client);
    } catch (e) {
        logger.error(e);
        throw e;
    }
};

module.exports = pool;