'use strict'
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/test')
const db = mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('openUri',function callback(){
    console.log("MongoDB连接成功!")
})

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