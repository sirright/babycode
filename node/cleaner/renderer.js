const electron = require('electron')
const ipc = electron.ipcRenderer;
const fs = require('fs');

//文件路径
let filepath 
//数据库用户名
let dbuser
//数据库用户密码
let dbpassword
//端口号
let dbport
//数据库名
let dbname
//数据库集合名
let dbcollection
//路径下所有文件名
let fnames = [];
$(document).ready(function(){
    //给默认值
    $('#filePath').val("F:/CloudSystemYN");
    $('#dbPort').val("localhost");
    $('#dbName').val("CloudSystemYN");
    $('#dbCollection').val("resourcelist");
    //开始清理
    $('.startClear').click(function(){
        let filepath = $("#filePath").val();
        let dbuser = $("#userName").val();
        let dbpassword = $("#userPassword").val();
        let dbport = $("#dbPort").val();
        let dbname = $("#dbName").val();
        let dbcollection = $("#dbCollection").val();
        $(".delData").html("");
        console.log("文件路径为:"+filepath);
        console.log("数据库名为:"+dbname);
        console.log("数据库集合名为:"+dbcollection);
        if(fsExistsSync(filepath)){
            if(pathConfirm(filepath)){
                console.log('here');
                ipc.send('start-clear',filepath,dbuser,dbpassword,dbport,dbname,dbcollection);
            }else{
                alert("路径不包含指定目录ChannelResource,GroupResource,PublicResource,Recycle,UserResource")
            }
        }else{
            alert("路径不存在,请重新输入!");
        }
    })
    //测试连接
    $('.connectTest').click(function(){
        let dbuser = $("#userName").val();
        let dbpassword = $("#userPassword").val();
        let dbport = $("#dbPort").val();
        let dbname = $("#dbName").val();
        let dbcollection = $("#dbCollection").val();
        if((dbname=="")||(dbcollection=="")||(dbport=="")){
            alert("请配置数据库");
        }else{
            ipc.send('connect-test',dbuser,dbpassword,dbport,dbname,dbcollection);
        }
    })
    //开启开发者工具
    $('.tool').click(function(){
        ipc.send('open-tool');
    })
    ipc.on('start-reply',function(event,msg){
        $(".delData").prepend("<p>"+msg+"</p>");
    })
    ipc.on('clear-finish',function(event,msg,count){
        alert(msg+"共清除了:"+count+"条数据");
    })
    ipc.on('connect-reply',function(event,msg){
        alert(msg);
    })
    ipc.on('delete-reply',function(event,deletedData,rate){
        $(".rate").text("删除进度:"+rate+"%");
        $(".delData").prepend("<p>"+"删除记录:"+deletedData+"</p>");
        ipc.send('delete-continue');
    })
    ipc.on('continue',function(event,rate){
        $(".rate").text("删除进度:"+rate+"%");
        ipc.send('delete-continue');
    })
})
//判断路径是否存在方法
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}
// 判断路径下是否包含指定目录
function pathConfirm(path){
    if(!fsExistsSync(path+"\/ChannelResource")&&fsExistsSync(path+"\/GroupResource")){
        console.log(1);
        return false;
    }
    if(!fsExistsSync(path+"\/GroupResource")){
        console.log(2);
        return false;
    }
    if(!fsExistsSync(path+"\/PublicResource")){
        console.log(3);
        return false;
    }
    if(!fsExistsSync(path+"\/Recycle")){
        console.log(4);
        return false;
    }
    if(!fsExistsSync(path+"\/UserResource")){
        console.log(5);
        return false;
    }
    return true;
}