$(document).ready(function(){
    var verifyCode;

    var options = {
        errors: {
            username: '用户名格式错误',
            passwordrule: '密码可包含数字、标点、字母，至少要包含一位大写字母。',
            passwordtips: '密码可包含数字、标点、字母，至少要包含一位大写字母且长度为8~16位',
            passwordmin: '密码长度不少于8位'
        },
        custom: {
            'username' : function($el) {
                var content = $el.val();
                if (content === '') {
                    return true;
                } else {
                    var re = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                    return re.test(content);
                }
            },
            'passwordrule': function($el) {
                var content = $el.val();
                var minLength = $el.data('passwordmin');
                var maxLength = $el.data('maxlength');
                if(content.length < minLength || content.length > maxLength) {
                    return true;
                } else {
                    var re = /([A-z\d\?\,\.\:\;\'\"\!\(\)])*[A-Z]/;
                    return re.test(content);
                }
            },
            'passwordtips': function($el) {
                return $el.val().length !== 1;
            },
            'passwordmin': function($el) {
                var length = $el.val().length;
                var minlength = $el.data('passwordmin');
                return (!$el.val()) || (length >= minlength) || (length === 1);
            }
        }
    };

    function ajaxReq(url, type, data) {
        return $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
    }

    //注册
    $('.registerForm').validator(options).on('submit', function(e){
        var registerEmail = $('#register-email').val();
        var registerPassword = $('#register-password').val();
        var invitationCode = $('#register-inviation-code').val();
        var registerPostData = {
            email: registerEmail,
            password: registerPassword,
            invitationcode: invitationCode
        };

        var regitsterUrl = CONFIG.urls.baseUrl + CONFIG.urls.registerUrl;
        if(e.isDefaultPrevented()) {
            $('#register-error').text('请填写注册信息');
        } else {
            e.preventDefault();
            register(regitsterUrl, registerPostData);
        }
    });

    function register(url, postData) {
        ajaxReq(url, 'post', postData).success(function(data) {
            if (data && data.code === 0) {
                var modalChangeData = {
                    hideDom: '#register',
                    showDom: '#relative-success',
                    tipDom: '.success-tips',
                    tipText:  '请登录您的邮箱激活账号'
                };
                var textMailData = {
                    text: '登录邮箱',
                    mail: postData.email,
                    dom: '#relative-success'
                };
                changeModal(modalChangeData);
                textMailJump('.success-click-button', textMailData, goToMailBox);
            } else if (data && data.code === 1) {
                $('#register-error').text(dataError(data));
            }
        }).error(function(data) {
            interfaceError('#register-error');
        });
    }

    //登录
    $('.loginForm').validator(options).on('submit', function(e) {
        var loginEmail = $('#login-email').val();
        var loginPassword = $('#login-password').val();
        var loginPostData = {
            email: loginEmail,
            password: loginPassword
        };
        var url = CONFIG.urls.baseUrl + CONFIG.urls.loginUrl;

        if(e.isDefaultPrevented()) {
            var errorText;
            if (loginEmail === '' || loginPassword === '') {
                errorText = '请填写登录信息';
            } else {
                errorText = '请输入正确信息';
            }
            $('#login-error').text(errorText);
        } else {
            e.preventDefault();
            login(url, loginPostData);
        }
    });

    function login(url, postData) {
        ajaxReq(url, 'post', postData).success(function(data) {
            if (data && data.code === 0) {
                docCookies.setItem('token', '\"' + data.data.token + '\"', undefined, '/', CONFIG.urls.domainUrl, undefined);
                window.location.href = CONFIG.urls.redirectUrl;
            } else if (data && data.code === 5) {
                var modalChangeData = {
                    hideDom: '#login',
                    showDom: '#not-yet-active'
                };
                var textMailData = {
                    mail: postData.email,
                    dom: '#not-yet-active'
                };
                changeModal(modalChangeData);
                textMailJump('.active-button', textMailData, goToMailBox);

                var sendActiveMailUrl = CONFIG.urls.baseUrl + CONFIG.urls.activeMailUrl;
                var sendActiveMailPostData = {
                    email: postData.email
                };

                //重新发送激活邮件
                $('.send-mail-again').on('click',function(e) {
                    e.preventDefault();
                    ajaxReq(sendActiveMailUrl, 'post', sendActiveMailPostData).success(function(data) {
                        if (data && data.code === 0) {
                            var modalChangeData = {
                                hideDom: '#not-yet-active',
                                showDom: '#relative-success',
                                tipDom: '.success-tips',
                                tipText:  '发送成功！'
                            };
                            var textMailData = {
                                text: '登录邮箱',
                                mail: postData.email,
                                dom: '#relative-success'
                            };
                            changeModal(modalChangeData);
                            textMailJump('.success-click-button', textMailData, goToMailBox);
                        } else if (data && data.code === 1) {
                            $('#send-active-mail-error').text(dataError(data));
                        }
                    }).error(function() {
                        interfaceError('#send-active-mail-error');
                    });
                });
            } else {
                $('#login-error').text('用户名或密码错误');
            }
        }).error(function(data, status) {
            interfaceError('#login-error');
        });
    }

    //忘记密码
    $('.resetMailForm').validator(options).on('submit', function(e) {
        var email = $('#reset-mail-address').val();
        var postData = {
            email: email
        };
        var url = CONFIG.urls.baseUrl + CONFIG.urls.resetPasswordUrl;

        if(e.isDefaultPrevented()) {
            if(email === '') {
                $('#reset-mail-error').text('请填写注册用户邮箱地址');
            }
        } else {
            e.preventDefault();
            resetMail(url, postData);
        }
    });

    function resetMail(url, postData) {
        ajaxReq(url, 'post', postData).success(function(data) {
            if (data && data.code === 0) {
                var modalChangeData = {
                    hideDom: '#reset-mail',
                    showDom: '#reset-tips',
                    tipDom: '.text-success',
                    tipText:  postData.email
                };
                var textMailData = {
                    text: '登录邮箱',
                    mail: postData.email,
                    dom: '#reset-tips'
                }
                changeModal(modalChangeData);
                textMailJump('.go-to-mailbox', textMailData, goToMailBox);    
            } else if(data && data.code === 1) {
                $('#reset-mail-error').text(dataError(data));
            }
        }).error(function(data) {
            interfaceError('#reset-mail-error');
        });
    }

    $('.resetPasswordForm').validator(options).on('submit', function(e) {
        var newPassword = $('#new-password').val();
        var newPasswordCompare = $('#new-password-compare').val();
        var postData = {
            'new_password': newPassword,
            'new_password_compare': newPasswordCompare
        };
        var url = CONFIG.urls.baseUrl + CONFIG.urls.verifyMailAddress;
        var resetCode = '$reset_code';
        url = url.replace(resetCode, verifyCode);

        if(e.isDefaultPrevented()) {
            if(newPassword === '' || newPasswordCompare === '') {
                $('#reset-password-error').text('请输入密码');
            }
        } else {
            e.preventDefault();
            resetPassword(url, postData)
        }
    });

    function resetPassword(url, postData) {
        ajaxReq(url, 'put', postData).success(function(data) {
            data.code = 0;
            if (data && data.code === 0) {
                var modalChangeData = {
                    hideDom: '#reset-password',
                    showDom: '#relative-success',
                    tipDom: '.success-tips',
                    tipText:  '密码重置成功！'
                };
                changeModal(modalChangeData);
                $('.success-click-button').text('立即登录数人云');
            } else if(data && data.code === 1){
                $('#reset-password-error').text(dataError(data));
            }
        }).error(function(data) {
            interfaceError('#reset-password-error');
        });   
    }

    // modal跳转
    function changeModal(data) {
        $(data.hideDom).modal('hide');
        $(data.showDom).modal('show');
        $(data.tipDom).text(data.tipText);
    }

    //添加button文字并跳转至邮箱
    function textMailJump(button, data, callback) {
        $(button).text(data.text).on('click', function(e) {
            e.preventDefault();
            callback(data.mail, data.dom);
        });
    }

    //跳转至邮箱
    function goToMailBox(mailAddress, dom) {
        var location = getMailServiceLink(mailAddress);
        if (location) {
            window.location.href = location;
        } else {
            $(dom).modal('hide');
        }
    }

    function getMailServiceLink(address) {
        var mailHash = {
            'gmail.com': 'https://mail.google.com',
            'yahoo.com': 'https://login.yahoo.com/',
            'qq.com': 'https://mail.qq.com/',
            'sina.com': 'http://mail.sina.com.cn/',
            '21cn.com': 'http://mail.21cn.com/',
            'sohu.com': 'http://mail.sohu.com/',
            'aol.com': 'http://mail.aol.com/',
            '163.com': 'http://mail.163.com/',
            '126.com': 'http://mail.126.com/',
            'yeah.net': 'http://www.yeah.net/',
            'dataman-inc.com': 'http://exmail.qq.com/login'
        };
        var service = address.split('@')[1];
        return mailHash[service];
    }

    function dataError(data) {
        if (data && data.errors) {
            for (var error in data.errors) {
                return data.errors[error];
            }
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
                dom: '#relative-success',
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
                    details[objKey].code = url.split('=')[1];
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
            verifyCode = result.code;

            ajaxReq(url, 'get').success(function(data) {
                if(data && data.code === 0) {
                    $(result.dom).modal('show');
                    if (result.key === 'active') {
                        $('.success-tips').text('激活成功');
                        $('.success-click-button').text('立即登录数人云');
                    }
                } else if (data && data.code === 1){
                    $('#relative-error').modal('show');
                    $('.text-danger').text(dataError(data));
                    $('.error-click-button').hide();
                }
            }).error(function(data) {
                //tips
                alert('服务器忙，请稍后再试。');
            });
        }
    })();

    $('a[data-toggle=popover]').popover().click(function(e) {
        e.preventDefault();
    });
});
