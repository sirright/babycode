var express = require('express');
var router = express.Router();
var glob = require('glob');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* GET home page. */
mongoose.connect('mongodb://127.0.0.1:27017/test');
console.log('connect succeed!');
var TestSchema = new mongoose.Schema({
    name: String
},{
    collection:'test'
});
console.log('schema creadted');
var testModel = mongoose.model('Test', TestSchema);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/trashclear',function(req,res,next){
    glob("F:/testlist/*",{nodir:false},function(err,files){
        for(let i=0;i<files.length;i++){
            let index = files[i].lastIndexOf("\/");
            files[i] = files[i].substring(index+1);
        }
        console.log(files);
    });
})

module.exports = router;
