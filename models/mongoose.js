const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/test')

const conn = mongoose.connection;

conn.on('open', ()=>console.log('连接成功'))