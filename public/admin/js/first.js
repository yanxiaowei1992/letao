$(function () {
  var page = 1;
  var pageSize = 2;
  render();
  // 页面渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        //分页
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
//点击添加按钮显示添加模态框
  $(".btn_sort").on("click", function () {
    $(".addModal").modal("show");
  })

// 表单校验
  $("form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类的名称"
          }
        }
      }
    },
  })
//注册验证成功事件
  $("form").on("success.form.bv",function (e) { 
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$("form").serialize(),
      success:function (info) { 
        if(info.success){
          $(".addModal").modal("hide");
          page = 1;
          render();
        }
       }
    })
   })




});