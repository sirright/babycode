<! Doctype html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script src="res/plugin/jquery-3.2.1.min.js" type="text/javascript"></script>
<body>
<h2>Hello World!</h2>
<p onclick="loginAjax()"> into</p>
</body>
<script>
    function loginAjax(){
        $.ajax({
            url:"/login",
            type:'post',
            dataType:'json',
            data:{},
            error:function(obj,err){
              console.log('请求失败:'+err);
            },
            success:function(data){
                console.log('请求成功');
                console.log(data);
            }
        });
    }
</script>
</html>