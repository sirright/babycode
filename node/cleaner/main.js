const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain 
const path = require('path')
const url = require('url')
const glob = require('glob')
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const fs = require('fs');
var Schema = mongoose.Schema;

//查到的数据记录总数,用于递归调用
let count = 0;
//用于保存被删除数据数
let deleteCount = 0;
//用于存放删除进度
let rate; 
//用来存放所有查到的数据转换成的buffer数组
let buffers = [];
//用来存放所有查到的数据转换成的string数组
let rstrings = [];
//用来存放被删除的所有记录
let deleteData = [];
//用来存放文件数组
let fnames = [];
//用来保存被删除数据的txt文件名
let now
let logName
//判断数据库连接是否成功
let connecting = false;
//数据库连接
let db
//操作数据库所用模板
let testSchema
let testModel 


app.on('ready', function(){
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600
  })
  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
  }))
  mainWindow.on('closed', function () {
      mainWindow = null
  })
  ipc.on('open-tool',function(){
      mainWindow.openDevTools();
      console.log('start');
  })
  ipc.on('delete-continue',function(){
      count++;
      rate = ((count+1)/(rstrings.length))*100;
      rate = Math.floor(rate);
      clearData(mainWindow);
  })
  ipc.on('connect-test',function(event,user,password,port,name,collection){
      connecting = false;
      connectionTest(event,user,password,port,name,collection);
  })
  ipc.on('start-clear',function(event,filepath,user,password,port,name,collection) {
    rate =0;
    now = new Date();
    logName = dateToString(now);
    if(!connecting){
      event.sender.send('connect-reply','请先测试数据库');
    }else{
      console.log("filepath:"+filepath);
      console.log("dbname:"+name);
      console.log("dbcollection:"+collection);
      connectAndModel(event,user,password,port,name,collection);
      //遍历路径下所有文件，获取路径名
      if(connecting){
        event.sender.send('start-reply',"正在清理数据,数据量可能较大,尽量不要进行其他操作!");
        glob(filepath+"/**",{nodir:false},function(err,files){
            event.sender.send('start-reply',"正在遍历文件路径");
            //遍历集合下所有数据，提取GUID
            testModel.find({},function(err,result){ 
                for(let r of result){
                  let rbuffer = r.GUID;
                  buffers.push(rbuffer);
                  let rstring = rbuffer.toString('hex');
                  rstring = guidSort(rstring);
                  rstrings.push(rstring);
                }
                //对路径名进行处理，提取出文件名
                for(let f of files){
                    let start = f.lastIndexOf('/');
                    let fname = f.substring(start+1);
                    let end = fname.indexOf('.');
                    if(end===-1){
                        let arr = fname.split('-');
                        fname = arr.join('');
                        fnames.push(fname);
                    }else{
                        fname = fname.substring(0,end);
                        let arr = fname.split('-');
                        fname = arr.join('');
                        fnames.push(fname);
                    }
                }
                event.sender.send('start-reply',"正在处理数据");
                clearData(mainWindow,testModel);
            })  
        })
      }
    }
  })
})
app.on('window-all-closed',function(){
  if (process.platform !== 'darwin') {
      app.quit()
  }
})
//清理脏数据
function clearData(window){
    if(count<rstrings.length){
      if(fnames.indexOf(rstrings[count])===-1){
        deleteData.push(rstrings[count]);
        deleteCount++;
        testModel.remove({GUID:buffers[count]},function(err,rst){
            if(err){
              console.log("err:"+err);
            }else{
              console.log(rst);
            }
        })
        window.webContents.send('delete-reply',rstrings[count],rate);
      }else{
        window.webContents.send('continue',rate);
      }
    }else{
      console.log('Delete count:'+deleteCount);
      window.webContents.send('clear-finish','清理完成',deleteCount);
      mongoose.connection.close;
      saveDeleteData();
      return;
    }
  }
//数据库连接测试方法
function connectionTest(event,user,password,port,name,collection){
    connecting = false;
    if((user=="")&&(password=="")){
      mongoose.connect('mongodb://'+port+'/'+name,function(err){
       if(err){
          event.sender.send('connect-reply','数据库连接失败');
          throw err;
        }else{
          connecting = true;
          event.sender.send('connect-reply','数据库连接成功');
        }
        mongoose.connection.close;
      });
    }else{
      mongoose.connect('mongodb://'+user+":"+password+"@"+port+"/"+name,function(err){
        if(err){
          event.sender.send('connect-reply','数据库连接失败');
          throw err;
        }else{
          connecting = true;
          event.sender.send('connect-reply','数据库连接成功');
        }
        mongoose.connection.close;
      });
    }
}
//点击开始清理后数据库连接测试和模板定义
function connectAndModel(event,user,password,port,name,collection){
  if((user=="")&&(password=="")){
      mongoose.connect('mongodb://'+port+'/'+name);
      db = mongoose.connection;
      db.on('error', function(){
        event.sender.send('connect-reply','数据库被修改,请重新测试数据库');
        connecting = false;
      });
      db.once('open', function (err) {
        testSchema = new Schema({
            GUID: Buffer
        },{
            collection:collection
        })
        testModel = mongoose.model(logName,testSchema);
        connecting = false;
      });
  }else{
    mongoose.connect('mongodb://'+user+":"+password+"@"+port+"/"+name);
    db = mongoose.connection;
    db.on('error', function(){
        event.sender.send('connect-reply','数据库被修改,请重新测试数据库');
        connecting = false;
    });
    db.once('open', function (err) {
      testSchema = new Schema({
        GUID: Buffer
      },{
        collection:collection
      })
      testModel = mongoose.model(logName,testSchema);
      connecting = true;
    });
  }
}
//对查询出来的GUID重新排序
function guidSort(string){
    let after = string.substring(16,32);
    let str1 = string.substring(6,8);
    let str2 = string.substring(4,6);
    let str3 = string.substring(2,4);
    let str4 = string.substring(0,2);
    let str5 = string.substring(10,12);
    let str6 = string.substring(8,10);
    let str7 = string.substring(14,16);
    let str8 = string.substring(12,14);
    return str1+str2+str3+str4+str5+str6+str7+str8+after;
}
//将所删除的记录写入以当前时间命名的txt文件
function saveDeleteData(){
  let alldata = deleteData.join("\n");
  fs.writeFile("./resources/app/deletelog/"+logName+".txt", alldata, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}
//将当前时间 转换为字符串
function dateToString(now){  
    var year = now.getFullYear();  
    var month =(now.getMonth() + 1).toString();  
    var day = (now.getDate()).toString();  
    var hour = (now.getHours()).toString();  
    var minute = (now.getMinutes()).toString();  
    var second = (now.getSeconds()).toString();  
    if (month.length == 1) {  
        month = "0" + month;  
    }  
    if (day.length == 1) {  
        day = "0" + day;  
    }  
    if (hour.length == 1) {  
        hour = "0" + hour;  
    }  
    if (minute.length == 1) {  
        minute = "0" + minute;  
    }  
    if (second.length == 1) {  
        second = "0" + second;  
    }  
     var dateTime = year + "-" + month + "-" + day +" "+ hour +"-"+minute+"-"+second;  
     return dateTime;  
}  