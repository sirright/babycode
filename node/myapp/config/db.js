var mysql= require('mysql');

var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'qq67641298',
    database:'zwj'
});
function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            callback(err,rows);
            connection.release();
        });
    });
}

exports.query = query;