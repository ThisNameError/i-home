function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(document).ready(function() {
    $("#form-name").submit(function(e){
        e.preventDefault();
        var name = $("#user-name").val()
        $.ajax({
            url: '/ihome/profile/',
            dataType: 'json',
            type: 'POST',
            data: {'name': name},
            success: function(data){
                if(data.code == '200'){
                    alert('更改成功');
                }
                if(data.code == '3001'){
                    alert(data.msg)
                }
                if(data.code == '3002'){
                    $(".fa fa-exclamation-circle").show();
                }
            },
            error: function(data){
                alert('更换用户名失败')
            }
        })
    })


    $('#form-avatar').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/ihome/upimg/',
            dataType: 'json',
            type: 'POST',
            success: function(data){
              if(data.code == '200'){
                  alert('上传成功')
              }
              if(data.code == '4000'){
                  alert(data.msg)
              }
            },
            error: function(data){
                alert('上传失败')
            }
        })
    })
})









