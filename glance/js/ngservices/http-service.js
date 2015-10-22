function glanceHttp($http, $state, $rootScope, utils) {
    var token;
    var clearCallback;
    
    var init = function (thetoken, theclearCallback) {
        token = thetoken;
        clearCallback = theclearCallback;
    };

    var ajaxBase = function (method, url, data, params, callback, errorCallback, warningCallback) {
        var fullURL = utils.buildFullURL(url);
        var headers = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        headers["Authorization"] = token;
        var req = {
            method: method,
            url: fullURL,
            headers: headers,
            cache: false,
            data: data,
            params: params
        };

        $http(req).success(function (data) {
            if(data && data.code === MESSAGE_CODE.success && callback) {
                callback(data);
            } else if(warningCallback) {
                warningCallback(data);
            } else {
                alert("服务未激活");
            }
        }).error(function (data, status) {
            if (status == 403) {
                window.location.href = BACKEND_URL.userUrl;
                $rootScope.$destroy();
            } else if(errorCallback){
                errorCallback(data, status);
            } else {
                console.log("request failed (" + status + ")");
                alert("服务未激活");
            }
        });

    };

    var ajaxGet = function (url, callback, params, errorCallback, warningCallback) {
        ajaxBase("get", url, null, params, callback, errorCallback, warningCallback);
    };

    var ajaxPost = function (url, data, callback, params, errorCallback, warningCallback) {
        ajaxBase("post", url, data, params, callback, errorCallback, warningCallback);
    };

    var ajaxFormPost = function(myScope, url, callback, errorCallback) {
        myScope.staticForm.$setPristine();
        myScope.message_error_info = {};
        ajaxPost(url, myScope.form, callback, undefined, errorCallback, function(data){
            if(data && data.code === MESSAGE_CODE.dataInvalid) {
                myScope.message_error_info = data.errors;
            }
        });
    };
    
    return {
        init: init,
        ajaxBase: ajaxBase,
        ajaxPost: ajaxPost,
        ajaxGet: ajaxGet,
        ajaxFormPost: ajaxFormPost
    };
}

glanceHttp.$inject = ["$http", "$state", "$rootScope", "utils"];
glanceApp.factory('glanceHttp', glanceHttp);
