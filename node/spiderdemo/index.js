var cheerio = require('cheerio');
var superagent = require('superagent');
superagent
    .get('http://www.cnblogs.com/LIUYANZUO')
    .end(function (err, sres) {
        if(err){
            console.log("err:"+err);
        }else{
            $ = cheerio.load(sres.text);
            $(".postTitle2").each(function(index,element){
                console.log($(element).text());
                console.log($(element).attr("href"));
            })
        }
    })