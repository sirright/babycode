var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/hello',function(req,res,next){
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
    res.write('hello World!'+'\n');
    res.end('end');
});

module.exports = router;