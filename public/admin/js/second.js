

$(function () {
  var page = 1;
  var pageSize = 5;
  render();
  //渲染页面
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
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
  //点击添加分类按钮显示模态框
  $(".btn_sort").on("click", function () {
    $(".addModal").modal("show");
    //发送ajax请求获得所有的一级分类数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        var html = template("tpl2", info);
        $('.dropdown-menu').html(html);
      }
    })
  })

  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    $(".dropdown-txt").text(txt);
    $('form').data("bootstrapValidator").updateStatus("categoryId","VALID");
    var id = $(this).data("id");
    $("[name='categoryId']").val(id);
  })

  //图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e,data) { 
      // console.log(data);
      // console.log(data.result.picAddr);
      $(".img_box img").attr("src",data.result.picAddr);
      console.log($(".img_box img"))
      $("[name='brandLogo']").val(data.result.picAddr);
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
     }
    
  })
//表单校验功能
$("form").bootstrapValidator({
  excluded:[],
  feedbackIcons: {
    valid: 'glyphicon glyphicon-thumbs-up',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields:{
    categoryId:{
      validators:{
        notEmpty:{
          message:"请选择一级分类",
        },
      }
    },
    categoryName:{
      validators:{
        notEmpty:{
          message:"请输入二级分类名称",
        }
      }
    },
    brandLogo:{
      validators:{
        notEmpty:{
          message:"请输入品牌图片"
        }
      }
    }
  }
})
$("form").on("success.form.bv",function (e) { 
  e.preventDefault();

  $.ajax({
    type:"post",
    url:"/category/addSecondCategory",
    data:$("form").serialize(),
    success:function (info) { 
      console.log($("form").serialize())
      console.log(info);
      if(info.success){
        $(".addModal").modal("hide");
        page=1;
        render();
        $("form").data("bootstrapValidator").resetForm(true);
        $(".dropdown-txt").text("请输入一级分类");
        $(".img_box img").attr("src","images/default.png")
      }
     }


  });



 })

});