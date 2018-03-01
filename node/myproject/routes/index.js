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
        req.session.user = user;
        console.log(req.session.user);
        res.end();
    })
    app.get('/session',function(req,res,next){
        res.send(req.session.user);
        res.end();
    })
}
module.exports = routes;
