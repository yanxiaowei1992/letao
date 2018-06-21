
$(function () {
  var page = 1;
  var pageSize = 5;
  var arr = [];//用于存上传图片的结果
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        // console.log(info);
        $("tbody").html(template("tpl", info));
        //分页
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          },
          itemTexts: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上页";
              case "next":
                return "下页";
              case "page":
                return page;
            }

          }
        })
      }
    })
  }
  $(".btn_sort").on("click", function () {
    $(".addModal").modal("show");
    //发送请求获取所有二级分类
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    })
  })
  //点击每个li将内容赋值给下拉框

  $(".dropdown-menu").on("click", "li", function () {
    var txt = $(this).text();
    $(".dropdown-txt").text(txt);
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
  })
  //图片上传


  $("#fileupload").fileupload({
    dataType: "json",
    done: function (e, data) {
      if (arr.length >= 3) {
        return;
      }
      console.log(data.result);
      
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" alt="">');
      arr.push(data.result);
      // console.log(arr);
      if (arr.length == 3) {

        $("form").data("bootstrapValidator").updateStatus("tip", "VALID");
      }else {
        $("form").data("bootstrapValidator").updateStatus("tip", "INVALID");
      }
    }

  })
  //表单校验功能
  $("form").bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      proName: {
        validators: {
          notEmpty: {
            message: "请输入产品的名称",
          }
        }
      },
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类",
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入产品描述",
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品的库存",
          },
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: "请输入正确的库存（1-99999）"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码",
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入正确的尺码范围（xx-xx）"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品的现价'
          }
        }
      },
      tip: {
        validators: {
          notEmpty: {
            message: "请上传3张图片",
          }
        }
      }
    }
  })
  //注册表单验证成功事件
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    var data = $("form").serialize();
    data += "&picName1=" + arr[0].picName + "&picAddr1=" + arr[0].picAddr;
    data += "&picName2=" + arr[1].picName + "&picAddr2=" + arr[1].picAddr;
    data += "&picName3=" + arr[2].picName + "&picAddr3=" + arr[2].picAddr;
    console.log(data);
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: data,
      success: function (info) {
        if(info.success){
          $(".addModal").modal("hide");
          page = 1;
          render();
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-txt").text("请选择二级分类");
          $(".img_box img").remove();
          arr=[];
        }
      }
    })
  })
});