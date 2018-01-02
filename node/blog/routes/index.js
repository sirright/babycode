var express = require('express');
var router = express.Router();

//mongodb
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
        
mongoose.connect('mongodb://127.0.0.1:27017/blog');
console.log('connect succeed!');
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: String
},{
    collection:'users'
});
console.log('schema creadted');

var userModel = mongoose.model('User', UserSchema);

/* GET index listing. */
router.get('/', function(req, res, next) {
    console.log('/ has been received!');
    userModel.findOne({age:"22"}, function (err, doc) {
        console.log('start find');
        if(err){
            console.log('err:'+err);
            return;
        }else{
            console.log(doc);
            res.render('index', {title: 'Express', user: doc });
        }
    });
});

module.exports = router;