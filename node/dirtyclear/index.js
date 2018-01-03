/*
该程序用于清理脏数据，这个脏数据分两种一种是资源记录被删除了，
但是文件还没有删除，另一种是文件删除了，但是数据库里记录没有删除。
*/
var glob = require('glob');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/test');

var TestSchema = new Schema({
    name:String
},{
    collection:'test'
})
var testModel = mongoose.model('Test',TestSchema);
//设置目标路径
var startpath = "F:/testlist";
//扫描目标目录，并将所有文件目录保存至数据库
//add(startpath);

//判断所给路径是否可用
if(fsExistsSync(startpath)){
    //清理脏数据
    cleartrash(startpath);
}else{
    console.log("该路径不可用,请重新输入！");
}
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}
//扫描目标目录并将文件路径保存至数据库方法
function add(path){
    glob(path+"/**",{nodir:false},function(err,files){
        for(let f of files){
            let newTest = {name:f};
            testModel.create(newTest,function(err){
                if(err){
                    console.log("err:"+err);
                    return;
                }else{
                    console.log("add succeed!");
                }
            });
        }
    });
} 
//删除文件夹方法
function deleteall(filepath) {  
    var files = [];  
    if(fs.existsSync(filepath)) {  
        files = fs.readdirSync(filepath);  
        files.forEach(function(file, index) {  
            var curPath = filepath + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }
        });  
        fs.rmdirSync(filepath);  
    }  
};  
//清理脏数据方法
function cleartrash(path){
    glob(path+"/**",{nodir:false},function(err,files){
        testModel.find(function(err,result){
            if(err){
                console.log("err:"+err);
                return;
            }else{
                let filedb = [];
                for(let rs of result){
                    filedb.push(rs.name);
                    //判断文件是否包含数据库的这条记录
                    if(files.indexOf(rs.name)===-1){
                        testModel.remove({name:rs.name},function(err,result){
                            if(err){
                                console.log("err:"+err);
                            }else{
                                //将数据库里被删除的记录在控制台打印
                                console.log("数据库删除记录:"+rs.name);
                            }
                        })
                    }
                }
                console.log(filedb);
                console.log(files);
                for(f of files){
                    if(filedb.indexOf(f)===-1){
                        let stat = fs.lstatSync(f);
                        if(stat.isDirectory()){
                            deleteall(f);
                        }else{
                            fs.unlinkSync(f);
                        }
                        //将被删除的文件在控制台打印
                        console.log("删除文件:"+f);  
                    }
                }
            }
        })
    });
}