$(function () {
  var $form = $("form");
  console.log($form);
  $form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {                                                             
        validators: {
          notEmpty: {
            message: "用户名不能为空",
          },
          stringLength: {
            message: "用户名长度3-9位",
            min: 3,
            max: 9
          },
          callback:{
            message:"用户名不正确",
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空",
          },
          stringLength: {
            message: "用户名长度6-12位",
            min: 6,
            max: 12
          },
          callback:{
            message:"密码不正确",
          }

        }
      }
    }
  })

  $form.on("success.form.bv", function (e) {
    e.preventDefault();
    console.log($(".btn_login"));
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$form.serialize(),
      success:function(info){
      if(info.success){
        location.href = "index.html";
      }
      if(info.error == 1000){
        $form.data("bootstrapValidator").updateStatus("username","INVALID","callback");
      }
      if(info.error == 1001){
        $form.data("bootstrapValidator").updateStatus("password","INVALID","callback");
      }
      }
    })


  })


  $(".btn_reset").on("click",function(){
    $form.data("bootstrapValidator").resetForm(true);
  })


  

});