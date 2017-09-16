const genericPool = require('generic-pool');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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
    min: 2,
    idleTimeoutMillis: 30000
};

const pool = genericPool.createPool(factory, opts);
pool.ObjectID = ObjectID;
pool.persist = async(task) => {
    let client = await pool.acquire();
    await task(client);
    pool.release(client);
};

module.exports = pool;