const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain 
const path = require('path')
const url = require('url')
const glob = require('glob')
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async')

var Schema = mongoose.Schema;

let arr= [];
for(let i=0;i<1000;i++){
  arr.push(i);
}
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
      console.log('start')
      function asyncFunction() {
          return new Promise(function (resolve, reject) {
              mainWindow.webContents.send('delete-reply',"test");
              sleep(2000);
              resolve("hh")
          });
      }

      asyncFunction()
      // .then(function (value) {
      //     console.log(value);    // => 'Async Hello world'
      // }).catch(function (error) {
      //     console.log(error);
      // });
      
      // let hh = async function(){
      //   function aa(){
      //     return new Promise(function(resolve,reject){
      //       mainWindow.webContents.send('delete-reply',"test");
      //       resolve()
      //     })
      //   }
      //   await aa();
      //   sleep(5000)
      // }
      // hh(); 

      
  })
  ipc.on('delete-continue',function(){
      console.log("hh")
  })
  ipc.on('connect-test',function(event,port,name,collection){
      connectionTest(event,port,name,collection);
  })
  ipc.on('start-clear',function(event,filepath,dbname,dbcollection) {
    console.log("filepath:"+filepath);
    console.log("dbname:"+dbname);
    console.log("dbcollection:"+dbcollection);
    event.sender.send('start-reply',"正在清理数据,数据量可能较大,尽量不要进行其他操作!");
    let date = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
    mongoose.connect('mongodb://localhost/'+dbname);
    let TestSchema = new Schema({
        GUID: Buffer
    },{
        collection:dbcollection
    })
    let testModel = mongoose.model(date,TestSchema);
    //遍历路径下所有文件，获取路径名
    glob(filepath+"/**",{nodir:false},function(err,files){
        //遍历集合下所有数据
        testModel.find({},function(err,result){  
            //新建文件数组,用来保存文件名
            let fnames = [];
            //用于保存被删除数据条数
            let count = 0;
            //对路径名进行处理，提取出GUID
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
            let deleteData = [];
            // let hh = async function(){
            //   function aa(i){
            //     return new Promise(function(resolve,reject){
            //       let rbuffer = result[i].GUID;
            //       let rstring = rbuffer.toString('hex');
            //       rstring = guidSort(rstring);
            //       if(fnames.indexOf(rstring)===-1){
            //         mainWindow.webContents.send('delete-reply',rstring);
            //       }
            //       resolve(i)
            //     })
            //   }
            //   for(let i=0;i<result.length;i++){
            //     await aa(i);
            //   }
            // }
            let hh = async function(){
              function aa(i){
                return new Promise(function(resolve,reject){
                  mainWindow.webContents.send('delete-reply',i);
                  ipc,on('delete-continue',)
                  resolve(i)
                })
              }
              for(let i=0;i<result.length;i++){
                   aa(i);
              }
            }
            hh(); 
            //删除不在文件中存在的数据记录
            // async.mapSeries(result,function(r,callback){
            //     clearData(r,fnames,mainWindow);
            //     callback(null,dbname);   
            // },function(err,results){
            //   console.log(err);
            //   console.log(results);
            // })
            // let arr = [1,2,3,4,5,6,7,8,9,0];
            // for(var i=0;i<3;i++){
            //       (function(i){
            //           setTimeout(function(){
            //               console.log(i);
            //           }, 1000);
            //       })(i)
            //   }
            
            
            // for(let r of result){
            //   (function (r){
            //     let rbuffer = r.GUID;
            //     let rstring = rbuffer.toString('hex');
            //     rstring = guidSort(rstring);
            //     if(fnames.indexOf(rstring)===-1){
            //         deleteData.push("删除记录:"+rstring);
            //         count++;
            //         mainWindow.webContents.send('delete-reply',rstring);
            //     }
            //           // testModel.remove({GUID:rbuffer},function(err,rst){
            //           //     if(err){
            //           //         console.log("err:"+err);
            //           //     }else{
            //           //         console.log(rst);
            //           //     }
            //           // })
            //     })(r)
            // }

            mainWindow.webContents.send('clear-finish','清理完成');
            // let alldata = deleteData.join("\n");
            // fs.writeFile('./resources/app/deletelog/'+date+".txt", alldata, function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            // });

            // fs.readFile('./resources/app/deletelog/data1.txt','utf8',function(err,data){
            //     if(err){
            //         console.log("err:"+err);
            //     }else{
            //         fs.appendFile('./resources/app/deletelog/data1.txt',alldata,function(err){
                        
            //         })
            //     }
            // })
            console.log(count);
        })
    })
  })
})
app.on('window-all-closed',function(){
  if (process.platform !== 'darwin') {
      app.quit()
  }
})
//一个睡眠方法
function sleep(n){
       var start=new Date().getTime();//定义起始时间的毫秒数
       while(true){
        var time=new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
        if(time-start>n){//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
         break;
        }
       }
      }
//数据库连接测试方法
function connectionTest(event,port,name,collection){
    mongoose.connect('mongodb://'+port+'/'+name,function(err){
      if(err){
        event.sender.send('connect-reply','数据库连接失败');
        throw err;
      }else{
        event.sender.send('connect-reply','数据库连接成功');
      }

    });
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
function clearData(dbname,filenames,window){
  let rbuffer = dbname.GUID;
  let rstring = rbuffer.toString('hex');
  rstring = guidSort(rstring);
  if(filenames.indexOf(rstring)===-1){
     window.webContents.send('delete-reply',rstring);
  }
}
//清理脏数据
// function clear(filepath,dbname,dbcollection){
//   mongoose.connect('mongodb://localhost/'+dbname);
//   let TestSchema = new Schema({
//       GUID: Buffer
//   },{
//       collection:dbcollection
//   })
//   let testModel = mongoose.model('Test',TestSchema);
//     //遍历路径下所有文件，获取路径名
//     glob(filepath+"/**",{nodir:false},function(err,files){
//         //遍历集合下所有数据
//         testModel.find({},function(err,result){  
//             //新建文件数组,用来保存文件名
//             let fnames = [];
//             //用于保存被删除数据条数
//             let count = 0;
//             //对路径名进行处理，提取出GUID
//             for(let f of files){
//                 let start = f.lastIndexOf('/');
//                 let fname = f.substring(start+1);
//                 let end = fname.indexOf('.');
//                 if(end===-1){
//                     let arr = fname.split('-');
//                     fname = arr.join('');
//                     fnames.push(fname);
//                 }else{
//                     fname = fname.substring(0,end);
//                     let arr = fname.split('-');
//                     fname = arr.join('');
//                     fnames.push(fname);
//                 }
//             }
//             //删除不在文件中存在的数据记录
//             for(let r of result){
//                 let rbuffer = r.GUID;
//                 let rstring = rbuffer.toString('hex');
//                 rstring = guidSort(rstring);
//                 if(fnames.indexOf(rstring)===-1){
//                     console.log("删除记录:"+rstring);
//                     deleteWindow.webContents.send('delete-reply',"hhh");
//                     count++;
//                     // testModel.remove({GUID:rbuffer},function(err,rst){
//                     //     if(err){
//                     //         console.log("err:"+err);
//                     //     }else{
//                     //         console.log(rst);
//                     //     }
//                     // })
//                 }else{

//                 }
//             }
//             console.log(count);
//         })
//     })
// }


// app.on('activate', () => {
//   if (win === null) {
//     createWindow()
//   }
// })
// main.js
// 当页面加载完成时，会触发`did-finish-load`事件。

