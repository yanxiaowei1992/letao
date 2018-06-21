$(function () {
  //动态渲染一级分类
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {
      console.log(info);
      $(".nav_left ul").html(template("tpl", info));
      renderSecond(info.rows[0].id);
    }
  })

  //动态渲染二级分类
  function renderSecond(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      success: function (info) {
        console.log(info);
        $(".category_right ul").html(template("secondTpl", info));

      }
    })



  }

  $(".nav_left").on("click","li",function () { 
    $(this).addClass("now").siblings().removeClass("now");
    var id = $(this).data("id");
    renderSecond(id);
    //让右边回到顶部
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
   })





});