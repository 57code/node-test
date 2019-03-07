const conf = require('./conf')
const MongoClient = require("mongodb").MongoClient;
const EventEmitter = require('events').EventEmitter;

class Mongodb {
    constructor(conf){
        //保存conf
        this.conf = conf;
        this.emitter = new EventEmitter();

        //连接
        this.client = new MongoClient(conf.url, {useNewUrlParser:true})
        this.client.connect(err => {
            if (err) {
                throw err;
            }
            console.log('连接数据库成功');
            this.emitter.emit('connect');
        })
    }

    // 监听事件方法
    once(event, cb){
        this.emitter.once(event, cb)
    }

    // 获取集合方法
    col(colName, dbName = this.conf.dbName){
        return this.client.db(dbName).collection(colName);
    }
}


module.exports = new Mongodb(conf);