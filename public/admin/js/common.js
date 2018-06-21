$(function () {

  


  //进度条功能
  NProgress.configure({ showSpinner: false });

  //注册一个全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
  $(document).ajaxStart(function () {
    //开启进度条
    // console.log("hehe")
    NProgress.start();
  
  });
  
  $(document).ajaxStop(function () {
    //完成进度条
    setTimeout(function () {
      NProgress.done();
    }, 500);
  });

  //每个一面一加载都判断是否登入，除了login页面
 if(location.href.indexOf("login.html") == -1){
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    success:function (info) {
      if(info.error == 400){
        location.href = "login.html";
      }
      }
  })
 }

  // 点击分类按钮染发以及和二级菜单显示出来

  $(".child").prev().on("click",function () {
      $(this).next().slideToggle();

    })

    //侧边栏显示隐藏功能
    // console.log( $(".icon_manu"))
    $(".icon_manu").on("click",function () {
      $(".lt_aside").toggleClass("now");
      $(".lt_main").toggleClass("now");
      })

      //退出功能
      $(".icon_logout").on("click",function () {
        $(".logoutModal").modal("show");

        })
        $(".btn_logout").on("click",function () {
          $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            success:function (info) {
              if(info.success){
                location.href = "login.html";
              }
            }
          })

          })



})