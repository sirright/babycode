'use strict'
const mongoose = require('mongoose')

console.log('连接成功');
const db = mongoose.connection
db.once('openUri',function callback(){
    console.log("MongoDB连接成功!")
})
mongoose.connect('mongodb://127.0.0.1:27017/test')
//创建Schema
const studentSchema = new mongoose.Schema({
    name: String,
    studentId: Number
},{
    collection:'test'
})
//创建Model
const studentModel = mongoose.model('newStudent',studentSchema)

module.exports = studentModel