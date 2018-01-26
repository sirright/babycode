const electron = require('electron')
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const fs = require('fs');
const async =require('async') 

$(document).ready(function(){
    $('#filePath').val("F:/CloudSystemYN");
    $('#dbPort').val("localhost");
    $('#dbName').val("CloudSystemYN");
    $('#dbCollection').val("resourcelist");
    $('.startclear').click(function(){
        let filepath = $("#filePath").val();
        let dbport = $("#dbPort").val();
        let dbname = $("#dbName").val();
        let dbcollection = $("#dbCollection").val();
        console.log("文件路径为:"+filepath);
        console.log("数据库名为:"+dbname);
        console.log("数据库集合名为:"+dbcollection);
        if(fsExistsSync(filepath)){
            console.log("该路径存在!");
            ipc.send('start-clear',filepath,dbname,dbcollection);
        }else{
            alert("路径不存在,请重新输入!");
            $("#filePath").val("");
        }
    })
    $('.connecttest').click(function(){
        let dbport = $("#dbPort").val();
        let dbname = $("#dbName").val();
        let dbcollection = $("#dbCollection").val();
        if((dbname=="")||(dbcollection=="")||(dbport=="")){
            alert("请配置数据库");
        }else{
            ipc.send('connect-test',dbport,dbname,dbcollection);
        }
    })
    $('.tool').click(function(){
        ipc.send('open-tool');
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
    ipc.on('start-reply',function(event,msg){
        $("h1").text(msg);
    })
    ipc.on('clear-finish',function(event,msg){
        alert(msg);
    })
    ipc.on('connect-reply',function(event,msg){
        alert(msg);
    })
    ipc.on('delete-reply',function(event,deletedData){
        // let hh = async function(){
        //     function aa(){
        //         return new Promise(function(resolve,reject){
        //             $("#delData").append("<p>"+deletedData+"</p>");
        //             resolve()
        //             ipc.send('delete-continue')
        //         })
        //     }
        //     await aa();
        // }
        // hh();
        $("#delData").append("<p>"+deletedData+"</p>");
        ipc.send('delete-continue');
    })
})
