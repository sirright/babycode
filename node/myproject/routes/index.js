'use strict'

/* GET home page. */
const routes = (app) => {
    app.get('/',(req,res,next) => {
        res.render('before');
    })
    app.get('/index',(req,res,next) => {
        res.render('index');
    })
}
module.exports = routes;
