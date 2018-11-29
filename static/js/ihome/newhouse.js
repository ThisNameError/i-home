function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $("#form-house-info").submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/house/addhouse/',
            dataType: 'json',
            type: 'POST',
            success: function(data){
                if(data.code == '200'){
                    $("#form-house-info").hide()
                    $("#form-house-image").show()
                    $("#house-id").val(data.house_id)
                }
            },
            error: function(){
                alert('发布失败')
            }
        })
    })

    $("#form-house-image").submit(function(e){
        e.preventDefault();
        var house_id = $("#house-id").val()
        $(this).ajaxSubmit({
            url: '/house/up_images/'+ house_id + '/',
            dataType: 'json',
            type: 'POST',
            success: function(data){
                if(data.code=='200'){
                    alert('上传成功');
                    location.href="/house/myhouse/";
                }
            },
            error: function(){
                alert('上传图片失败')
            }
        })
    })
})