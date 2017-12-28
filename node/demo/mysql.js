var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'qq67641298',
    port:'3306',
    database:'zwj'
});
var sql = "select * from websites";
connection.connect(function(err){
    if(err){
        console.log('connect-' + err);
    }
    console.log('connect succeed...');
});
connection.query(sql,function(err,result){
    if(err){
        console.log("query-"+err.message);
    }
    console.log(result);
});
connection.end(function(err){
    if(err){
        return;
    }
    console.log("close succeed");
});