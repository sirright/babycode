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
        let name = req.body.studentName;
        let studentId = parseInt(req.body.studentId);
        console.log("name:"+name+","+"id:"+studentId);
        studentModel.find({},function(err,result,res){
            if(err){
                console.log("err:"+err)
            }else{
                for(let r of result){
                    if(r.name===name||r.studentId===studentId){
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
                        response.end("<a href='/'>添加成功,点击返回首页</a>")
                    }
                })
            }
        })
    })
    app.get('/search',function(req,res,next){
        let response = res;
        response.setHeader("Content-type","text/html;charset=utf-8");
        studentModel.find({},function(err,result,res){
            response.render('search',{title:'查询学生',result:result})
        })
    })
    app.post('/search',function(req,res,next){
        let response = res;
        response.setHeader("Content-type","text/html;charset=utf-8");
        let searchContent = req.body.searchContent;
        if(searchContent===""){
            studentModel.find({},function(err,result,res){
                if(err){
                    console.log("err:"+err);
                }else{
                    response.render('search',{title:'查询学生',result:result})
                }
            })
        }else{
            studentModel.find({name:searchContent},function(err,result,res){
                if(err){
                    console.log("err:"+err);
                }else{
                    let result1 = JSON.stringify(result);
                    response.render('search',{title:'查询学生',result:result});
                    response.end();
                }
            })
        }
    })
    app.get('/delete',function(req,res,next){
        let response = res;
        response.setHeader("ContentType","text/html;charset=utf-8");
        studentModel.find({},function(err,result,res){
            if(err){
                console.log("err:"+err);
            }else{
                response.render('delete',{title:'删除学生',result:result});
            }
        })
    })
    app.post('/delete',function(req,res,next){
        let response = res;
        let idx = req.body.idx;
        idx = parseInt(idx);
        response.setHeader("ContentType","text/html;charset=utf-8");
        studentModel.find({},function(err,result,res){
            let name = result[idx].name;
            studentModel.remove({"name":name},function(err,result){
                if(err){
                    console.log('err:'+err);
                }else{
                    response.end();
                }
            })
        })
    })
    app.get('/update',function(req,res,next){
        let response = res;
        response.setHeader("ContentType","text/html;charset=utf-8");
        studentModel.find({},function(err,result,res){
            if(err){
                console.log("err:"+err);
            }else{
                response.render('update',{title:'修改学生',result:result})
            }
        })
    })
    app.post('/update',function(req,res,next){
        
        let response = res;
        let newName = req.body.studentName;
        let newId = req.body.studentId;
        let idx = req.body.idx;
        response.setHeader("ContentType","text/plain;charset=utf-8");
        studentModel.find({},function(err,result,res){
            let oldName = result[idx].name;
            studentModel.update({name:oldName},{name:newName,studentId:newId},function(err,result){
                if(err){
                    console.log("err:"+err);
                }else{
                    response.end();
                }
            })
        })
    })
}
module.exports = routes;