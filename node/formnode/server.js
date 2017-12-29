var http = require('http');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
    if(req.url=='/dopost'&& req.method.toLowerCase() == 'post'){
        var alldata ='';
        req.on('data',function(chunk){
            alldata+=chunk;
        })
        req.on('end', function () {
            console.log("alldata is "+alldata);
            var datastring = alldata.toString()//得到的是一个字符串 需要解析
            console.log("datastring is "+datastring);
            var obj= querystring.parse(datastring);//定义一个对象来存放解析后的值
            console.log(obj.name);
            console.log(obj.age);
            console.log(obj.sex);
            console.log(obj.checkbox[0]);
            res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
            res.end('请求成功');
        })
    }
})
server.listen(9999,'127.0.0.1');//设置监听端口和监听地址