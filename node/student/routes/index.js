'use strict'
const studentModel = require('../models/student_model')
/* GET home page. */
const routes = function(app){
    app.get('/',function(req,res,next){
        let response = res
        studentModel.find({},function(err,result,res){
            if(err){
                console.log("err:"+err)
            }else{
                response.render('index',{result:result,title:'杰哥好'})
            }
        })
    })
    app.get('/add',function(req,res,next){
        res.render('add',{title:'添加学生'})
    })
    app.post('/add',function(req,res,next){
        let response = res;
        response.setHeader("Content-type","text/html;charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin","*");
        let name = req.body.studentName;
        let studentId = parseInt(req.body.studentId);
        console.log("name:"+name+","+"id:"+studentId);
        studentModel.find({},function(err,result,res){
            if(err){
                console.log("err:"+err)
            }else{
                for(let r of result){
                    console.log(r.name)
                    if(r.name===name||r.studentId===studentId){
                        console.log('failed');
                        response.end("<a href='/'>姓名或id已存在,添加失败,点击返回首页</a>")
                        return;
                    }
                }
                let newStudent ={
                    name: name,
                    studentId: studentId
                }
                studentModel.create(newStudent,function(err){
                    if(err){
                        console.log("err:"+err)
                    }else{
                        console.log('succeed');
                        response.end("<a href='/'>添加成功,点击返回首页</a>")
                    }
                })
            }
        })
    })
}
module.exports = routes;
