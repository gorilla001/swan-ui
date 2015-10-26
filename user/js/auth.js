$(document).ready(function(){
    var verifyCode;
    function ajaxReq(url, type, data) {
        return $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
    };

    function loginIn(url, postData) {
        ajaxReq(url, 'post', postData).success(function(data) {
            if (data && data.code === 0) {
                docCookies.setItem('token', '\"' + data.data.token + '\"', undefined, '/', CONFIG.urls.domainUrl, undefined);
                window.location.href = CONFIG.urls.redirectUrl;
            } else {
                $('#login-error').text('用户名或密码错误');
            }
        }).error(function(data, status) {
            interfaceError('#login-error');
        });
    }

    var options = {
        errors: {
            username: '用户名格式错误',
            password: '密码格式错误'
        },
        custom: {
            'username' : function($el) {
                var content = $el.val();
                if (content === '') {
                    return true;
                } else {
                    var format = '@';
                    var rule = Boolean($el.val().indexOf(format) > -1)
                    return rule;
                }
            },
            'password': function($el) {
                var content = $el.val();
                var minLength = $el.data('minlength');
                var maxLength = $el.data('maxlength');
                if(content.length < minLength || content.length > maxLength) {
                    return true;
                } else {
                    var re = /([A-z\d\?\,\.\:\;\'\"\!\(\)])*[A-Z]/g;
                    return re.test(content);
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
             loginIn(url, loginInPostData);
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
            ajaxReq(regitsterUrl, 'post', registerPostData).success(function(data) {
                if (data && data.code === 0) {
                    loginIn(loginInUrl, registerPostData);
                } else if (data && data.code === 1) {
                    var error = dataError(data.errors);
                    $('#register-error').text(error);
                }
            }).error(function(data) {
                interfaceError('#register-error');
            });
        }
    });

    $('.resetMailForm').validator(options).on('submit', function(e) {
        var resetMail = $('#reset-mail-address').val();
        var data = {
            email: resetMail
        };
        var url = CONFIG.urls.baseUrl + CONFIG.urls.resetPasswordUrl;

        if(e.isDefaultPrevented()) {
            if(resetMail === '') {
                $('#reset-mail-error').text('请填写注册用户邮箱地址');
            }
        } else {
            e.preventDefault();
            ajaxReq(url, 'post', data).success(function(data) {
                if (data && data.code === 0) {
                    $('#reset-mail').modal('hide');
                    $('#reset-tips').modal('show');
                    $('.jump-mail').text(resetMail);    
                } else if(data && data.code === 1) {
                    var error = dataError(data.errors);
                    $('#reset-mail-error').text(error);
                }
            }).error(function(data) {
                interfaceError('#reset-mail-error');
            });
        }
    });

    $('.resetTipsForm').on('submit', function(e) {
        e.preventDefault();
        var mailAddress = $('#reset-mail-address').val();
        var location = getMailServiceLink(mailAddress);
        if(location) {
            window.location.href = location;
        } else {
            $('#reset-tips').modal('hide');
        }
    });

    $('.resetPasswordForm').validator(options).on('submit', function(e) {
        var newPassword = $('#new-password').val();
        var newPasswordCompare = $('#new-password-compare').val();
        var postData = {
            "new_password": newPassword,
            "new_password_compare": newPasswordCompare
        };
        var url = CONFIG.urls.baseUrl + CONFIG.urls.verifyMailAddress;
        var resetCode = '$reset_code';
        url = url.replace(resetCode, verifyCode);

        if(e.isDefaultPrevented()) {
            if(newPassword === '') {
                $('#reset-password-error').text('请输入密码');
            }
        } else {
            e.preventDefault();
            ajaxReq(url, 'post', postData).success(function(data) {
                if (data && data.code === 0) {
                    $('#reset-password').modal('hide');
                    $('#reset-success').modal('show');
                } else if(data && data.code === 1){
                    var error = dataError(data.errors);
                    $('#reset-password-error').text(error);
                }
            }).error(function(data) {
                interfaceError('#reset-password-error');
            });
        }
    });
    
    $("a[data-toggle=popover]").popover().click(function(e) {
        e.preventDefault();
    });

    function getMailServiceLink(address) {
        var mailHash = {
            'gmail.com': 'https://mail.google.com', 
            'qq.com': 'https://mail.qq.com/'
        };
        var service = address.split('@')[1];
        return mailHash[service];
    }

    function dataError(errors) {
        var error;
        for (error in errors) {
            error = data.errors[error];
            return error;
        }
    }

    function interfaceError(dom) {
        $(dom).text('服务器忙，请稍后再试。');
    }

    function getQueryResult(url) {
        var details = {
            verify: {
                key: 'code',
                replaceWord: '$reset_code',
                url: 'verifyMailAddress',
                dom: '#reset-password',
                errorDom: '#reset-password-error'
            },
            active: {
                key: 'active',
                replaceWord: '$active_code',
                url: 'activeUrl',
                dom: 'active-success',
                errorDom: '#active-success-error'
            }
        };
        if(url.indexOf('=') > -1) {
            var code;
            var objKey;
            var key;
            for (objKey in details) {
                key = details[objKey].key;
                if (url.indexOf(key) > -1) {
                    code = url.split('=')[1];
                    details[objKey].code = code.substr(0, code.length-1);
                    return details[objKey];
                }
            }
        }
    }

    (function confirm(){
        var result = getQueryResult(location.search);

        if(result) {
            var url = CONFIG.urls.baseUrl + CONFIG.urls[result.url];
            url = url.replace(result.replaceWord, result.code);

            ajaxReq(url, 'get').success(function(data) {
                if(data && data.code === 0) {
                    $(result.dom).modal('show');
                } else if (data && data.code === 1){
                    // 密码重置失败或者激活失败如何处理？
                    // var error = dataError(data.errors);
                    // $(result.errorDom).text(error);
                }
            }).error(function(data) {
                //tips
            });
        }
    })();
});
