var glob = require('glob');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/test');

var TestSchema = new mongoose.Schema({
    name:String
},{
    collection:'test'
});
var testModel = mongoose.model('Test',TestSchema);
glob("F:/testlist/*",{nodir:false},function(err,files){
    for(let i=0;i<files.length;i++){
        let index = files[i].lastIndexOf("\/");
        files[i] = files[i].substring(index+1);
    }
    console.log(files);
});