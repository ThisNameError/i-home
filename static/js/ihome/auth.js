function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function() {
    $.get('/ihome/id_card/',function(data){
        if (data.code == 1203){
        $("#checkOK").hide()
        alert(data.msg)
        }
    })

    $("#form-auth").submit(function(e){
        e.preventDefault();
        var name = $("#real-name").val();
        var id_code = $("#id-card").val();
        $.ajax({
            url: '/ihome/check_info/',
            dataType: 'json',
            data: {
                'real_name': name,
                'id_card': id_code
            },
            type: 'POST',
            success: function(data){
                if(data.code == 200){
                    alert('认证成功')
                    $("#checkOK").hide()
                }
                if(data.code == 1201){
                    alert(data.msg)
                }
                if(data.code == 1202){
                    alert(data.msg)
                }
            },
            error: function(data){
                alert('认证失败')
            }
        })
    })
})


