

$(function () {
  var page = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        //分页
        console.log($(".paginator"))
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        })
      }
    })
  }

  $("tbody").on("click", ".btn", function () {
    //显示模态框
    $(".userModal").modal("show");
    var id = $(this).parent().data("id");
   
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    //console.log(id, isDelete);

    $(".btn_user").off().on("click", function () {
      //发送ajax请求
      $.ajax({
        type: 'post',
        url:'/user/updateUser',
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function(info) {
          if(info.success) {
            //关闭模态框
            $(".userModal").modal('hide');
            //重新渲染
            render();
          }
        }
      })
  
    });
  });
})















