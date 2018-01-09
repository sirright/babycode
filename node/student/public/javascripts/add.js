$(document).ready(function(){
  $("#add").click(function(){
    let reg1 = new RegExp('/^$/')
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:3000/add',
      data: "studentName="+$("#studentName").val()+"&studentId="+$("#studentId").val(),
      dataType:'html',
      async:true,
      error:function(obj,err){
        alert('请求失败');
      },
      success:function(data){
        alert('请求成功');
        document.write(data);
      } 
    });
  })
})