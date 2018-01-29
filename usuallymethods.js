//一个睡眠方法
function sleep(n){
    var start=new Date().getTime();//定义起始时间的毫秒数
    while(true){
        var time=new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
        if(time-start>n){//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
            break;
        }
    }
}