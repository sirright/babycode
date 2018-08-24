/*
* @Author: Administrator
* @Date:   2018-07-26 10:46:59
* @Last Modified by:   Administrator
* @Last Modified time: 2018-08-20 14:30:36
*/
//请求模块
const superagent = require('superagent');
//分析爬取后的数据
const cheerio = require('cheerio');
//异步模块
const async = require('async');
//处理文件模块
const fs = require('fs');
//url模块
const url = require('url');
//请求模块
const request = require('request');
//虎扑请求路径
const hupuUrl = 'https://bbs.hupu.com/selfie-type1';

let ssr = [];
let allUrl = [];
let curCount = 0;
let path = "F://temp"+"/"+"page-"+1+"/"+"count-"+(1+1);
console.log(nextPath(path));
console.log(path);
mkdirs(path,function(err){
    if(err){
        return console.log(err);
    }else{
        console.log(nextPath(path));
        console.log(nextPath(nextPath(path)));
    }
});
// for(let i=1;i<6;i++){
//     let hupuUrl2 = hupuUrl+"-"+i;
//     //请求爆照区前五个页
//     superagent.get(hupuUrl2)
//         .end(function(err,res){
//             if(err){
//                 return false;
//             }
//             let $ = cheerio.load(res.text);
//             $('.titlelink>a:first-child').next().each(function(idx,element){
//                 let hupuUrl3 = "https://bbs.hupu.com"+$(element).attr("href");
//                 //console.log(hupuUrl3);
//                 //遍历请求爆照区每个帖子
//                 superagent.get(hupuUrl3)
//                     .end(function(err1,res1){
//                         if(err1){
//                            return false;
//                         }
//                         let $1 = cheerio.load(res1.text);
//                         let title = $1('.bbs-hd-h1>h1').attr('data-title');
                        
//                         for(let j=0;j<=5;j++){
//                             let img = $1('.quote-content').find('img').eq(j).attr('src');
//                             if(img==undefined){
//                                 break;
//                             }
//                             // console.log("爆照区第"+i+"页"+"第"+(idx+1)+"条帖子"+"第"+(j+1)+"张照片");
//                             // console.log(img);
//                             //存储爆照图片路径
//                             let filePath = "F://temp"+"/"+"page-"+i;
//                             let deepPath = "F://temp"+"/"+"page-"+1+"/"+"count-"+(1+1);
//                             fs.exists(deepPath,function(exists){
//                                 if(exists){

//                                 }else{

//                                 }
//                             })

//                         }
//                     });
//             });
//         })  
// }
function mkdirs(path, callback) {  
    fs.exists(nextPath(path), function (exists) {  
        if (!exists) {  
           fs.mkdir(nextPath(path),function(err){
                if(err){
                    return false;
                }
           })
        } else {  
            fs.exists(path,function(exists1){
                if(!exists1){
                    fs.mkdir(path,function(err1){

                    })
                }
            })  
        }  
    });  
}  
function nextPath(path){
    let start = path.indexOf("/",5);
    let end = path.indexOf("/",start+1);
    if(end==-1){
        return path;
    }else{
        return path.substring(0,end);
    }
}