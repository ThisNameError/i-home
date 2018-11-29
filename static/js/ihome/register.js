function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

var imageCodeId = "";

function generateUUID() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function generateImageCode() {
    var new_code = ''
    var codes = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z'];
    for( var i = 0; i < 4; i++){
        var index = Math.floor(Math.random()*36);
        new_code += codes[index];
    }
    $("#check_code").html(new_code);
}

function sendSMSCode() {
    $(".phonecode-a").removeAttr("onclick");
    var mobile = $("#mobile").val();
    if (!mobile) {
        $("#mobile-err span").html("请填写正确的手机号！");
        $("#mobile-err").show();
        $(".phonecode-a").attr("onclick", "sendSMSCode();");
        return;
    } 
    var imageCode = $("#imagecode").val();
    if (!imageCode) {
        $("#image-code-err span").html("请填写验证码！");
        $("#image-code-err").show();
        $(".phonecode-a").attr("onclick", "sendSMSCode();");
        return;
    }
    $.get("/api/smscode", {mobile:mobile, code:imageCode, codeId:imageCodeId}, 
        function(data){
            if (0 != data.errno) {
                $("#image-code-err span").html(data.errmsg); 
                $("#image-code-err").show();
                if (2 == data.errno || 3 == data.errno) {
                    generateImageCode();
                }
                $(".phonecode-a").attr("onclick", "sendSMSCode();");
            }   
            else {
                var $time = $(".phonecode-a");
                var duration = 60;
                var intervalid = setInterval(function(){
                    $time.html(duration + "秒"); 
                    if(duration === 1){
                        clearInterval(intervalid);
                        $time.html('获取验证码'); 
                        $(".phonecode-a").attr("onclick", "sendSMSCode();");
                    }
                    duration = duration - 1;
                }, 1000, 60); 
            }
    }, 'json'); 
}

$(document).ready(function() {
    generateImageCode();
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#imagecode").focus(function(){
        $("#image-code-err").hide();
    });
    $("#phonecode").focus(function(){
        $("#phone-code-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
        $("#password2-err").hide();
    });
    $("#password2").focus(function(){
        $("#password2-err").hide();
    });
    $(".form-register").submit(function(e){
        e.preventDefault();  //阻止默认行为
        mobile = $("#mobile").val();
        phoneCode = $("#phonecode").val();
        passwd = $("#password").val();
        passwd2 = $("#password2").val();
        imagecode = $("#imagecode").val().toUpperCase();
        val = $("#check_code").html()
        if (imagecode != val) {
            $("#image-code-err").html('请输入正确的验证码');
            $("#image-code-err").show();
            generateImageCode();
            return;
        }
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
//        if (!phoneCode) {
//            $("#phone-code-err span").html("请填写短信验证码！");
//            $("#phone-code-err").show();
//            return;
//        }
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }
        if (passwd != passwd2) {
            $("#password2-err span").html("两次密码不一致!");
            $("#password2-err").show();
            return;
        }
        $.ajax({
            url: '/ihome/register/',
            dataType: 'json',
            type: 'POST',
            data: {'mobile': mobile, 'password': passwd, 'password2': passwd2},
            success: function(data){
                if(data.code == '200'){
                    location.href='/ihome/login/';
                }
                if(data.code == '1001'){
                    alert('请重新输入信息')
                }
                if(data.code == '1002'){
                    alert('请输入正确的手机号')
                }
                if(data.code == '1003'){
                    alert('手机号已注册，请换手机号注册')
                }
                if(data.code == '1004'){
                    alert('两次密码不一致，请重新输入密码')
                }
            },
            error: function(){
                alert('注册失败')
            },
        })
    });
})