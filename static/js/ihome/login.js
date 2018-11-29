function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        }
        if (mobile) {
            var re_tel = /^1[34578]\d{9}$/;
            if (!re_tel.test(mobile)){
                $("#mobile-err span").html("请填写正确的手机号！");
                $("#mobile-err").show();
                return;
            }
        }
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }
        $.ajax({
            url: '/ihome/login/',
            dataType: 'json',
            type: 'POST',
            data: {
                'mobile': mobile,
                'password': passwd
            },
            success: function(data){
                if(data.code == '200'){
                    location.href='/ihome/my/';
                }
                if(data.code == '2001'){
                    alert('手机号不存在，请先注册');
                }
                if(data.code == '2002'){
                    alert('密码不正确');
                }
            },
            error: function(data){
                alert('注册失败')
            },
        })
    });
})