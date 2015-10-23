$(document).ready(function(){
    function ajaxPost(postData, url) {
        return $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify(postData),
            dataType: 'json',
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
    }

    function loginIn(postData, url) {
        ajaxPost(postData, url).success(function(data) {
            if (data && data.code === 0) {
                docCookies.setItem('token', '\"' + data.data.token + '\"', undefined, '/', CONFIG.urls.domainUrl, undefined);
                window.location.href = CONFIG.urls.redirectUrl;
            } else {
                $('#login-error').text('用户名或密码错误');
            }
        }).error(function(data, status) {
            alert('请稍候再试');
        });
    }

    var options = {
        errors: {
            format: '用户名格式错误'
        },
        custom: {
            'format' : function($el) {
                var content = $el.val();
                if (content === '') {
                    return true;
                } else {
                    var format = '@';
                    var rule = Boolean($el.val().indexOf(format) > -1)
                    return rule;
                }
            }
        }
    }

    $('.loginInForm').validator(options).on('submit', function(e) {
        var loginInEmail = $('#login-in-email').val();
        var loginInPassword = $('#login-in-password').val();
        var loginInPostData = {
            email: loginInEmail,
            password: loginInPassword
        };

        var url = CONFIG.urls.baseUrl + CONFIG.urls.loginInUrl;

        if(e.isDefaultPrevented()) {
            var errorText;
            if (loginInEmail==='' || loginInPassword==='') {
                errorText = '请填写登录信息';
            } else {
                errorText = '请输入正确信息';
            }
            $('#login-error').text(errorText);
        } else {
             e.preventDefault();
             loginIn(loginInPostData, url);
        }
    });

    $('.registerForm').validator(options).on('submit', function(e){

        var registerEmail = $("#register-email").val();
        var registerPassword = $('#register-password').val();
        var invitationcode = $('#register-inviation-code').val();
        var registerPostData = {
            email: registerEmail,
            password: registerPassword,
            invitationcode: invitationcode
        };

        var regitsterUrl = CONFIG.urls.baseUrl + CONFIG.urls.registerUrl;
        var loginInUrl = CONFIG.urls.baseUrl + CONFIG.urls.loginInUrl;
        if(e.isDefaultPrevented()) {
            $('#register-error').text('请填写完整信息');
        } else {
            e.preventDefault();
            ajaxPost(registerPostData, regitsterUrl).success(function(data) {
                if (data.code === 0) {
                    loginIn(registerPostData, loginInUrl);
                } else if (data.code === 1) {
                    var error;
                    for (error in data.errors) {
                        $('#register-error').text(data.errors[error]);
                        break;
                    }
                }
            }).error(function(data) {
                alert('注册失败，请稍后再试');
            });
        }
    });

    $('.resetMailForm').validator(options).on('submit', function(e) {
        var resetMail = $('#reset-mail-address').val();
        
        if(e.isDefaultPrevented()) {
            if(resetMail === '') {
                $('#reset-mail-error').text('请填写邮箱地址');
            }
        } else {
            e.preventDefault();
            $('#reset-mail').modal('hide');
            $('#reset-tips').modal('show');
            $('.jump-mail').text(resetMail);
        }
    });

    $('.resetTipsForm').on('submit', function(e) {
        e.preventDefault();
        $('#reset-tips').modal('hide');
        $('#reset-password').modal('show');
        // 跳转至邮箱
    });

    $('.resetPasswordForm').validator().on('submit', function(e) {
        var newPassword = $('#new-password').val();
        var postData;
        var url;

        if(e.isDefaultPrevented()) {
            if(newPassword === '') {
                $('#reset-password-error').text('请输入密码');
            }
        } else {
            e.preventDefault();
            $('#reset-password').modal('hide');
            $('#reset-success').modal('show');
            // ajaxPost(postData, url).success(function(data) {
            //     if (data && data.code === 0) {
            //         $('#reset-password').modal('hide');
            //         $('#reset-success').modal('show');
            //     } else {
            //         tips
            //     }
            // }.errors(function(data) {
            //     tips
            // }));
        }
    });

    $('.resetSuccessForm').validator(options).on('submit', function(e) {
        e.preventDefault();
        var loginInPostData;
        var url = CONFIG.urls.baseUrl + CONFIG.urls.loginInUrl;
        loginIn(loginInPostData, url);
    });
    
    $("a[data-toggle=popover]").popover().click(function(e) {
      e.preventDefault();
    });
});
