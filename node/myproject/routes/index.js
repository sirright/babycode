'use strict'

/* GET home page. */
const routes = function(app){
    app.get('/',function(req,res,next){
        res.render('login');
    })
    app.get('/main',function(req,res,next){
        res.render('main');
    })
    app.post('/login',function(req,res,next){
        let user = req.body.user;
        let password = req.body.password;
        let logArea =  req.body.logArea;
        req.session.user = user;
        req.session.password = password;
        req.session.logArea = logArea;
        res.end();
    })
    app.get('/session',function(req,res,next){
        let jsonStr = {
            "user" : req.session.user,
            "password" : req.session.password,
            "logArea" : req.session.logArea
        };
        res.send(jsonStr);
        res.end();
    })
}
module.exports = routes;
