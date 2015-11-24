function glanceHttp($http, $state, $rootScope, utils, Notification) {
    var token;
    var clearCallback;
    
    var init = function (thetoken, theclearCallback) {
        token = thetoken;
        clearCallback = theclearCallback;
    };

    var ajaxBase = function (method, url, data, params, callback, errorCallback, warningCallback) {
        var fullURL;
        if (angular.isArray(url)) {
            fullURL = utils.buildFullURL(url[0], url[1]);
        } else {
            fullURL = utils.buildFullURL(url);
        }
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
            if (data && callback && (data.code == undefined || data.code === MESSAGE_CODE.success)) {
                callback(data);
            } else if (warningCallback) {
                warningCallback(data);
            } else {
                Notification.error("服务未激活");
            }
        }).error(function (data, status) {
            if (status == 403) {
                window.location.href = USER_URL;
                $rootScope.$destroy();
            } else if(errorCallback){
                errorCallback(data, status);
            } else {
                console.log("request failed (" + status + ")");
                Notification.error("服务未激活");
            }
        });

    };

    var ajaxGet = function (url, callback, params, errorCallback, warningCallback) {
        ajaxBase("get", url, null, params, callback, errorCallback, warningCallback);
    };
    
    var ajaxDelete = function (url, callback, data, params, errorCallback, warningCallback) {
        ajaxBase("delete", url, data, params, callback, errorCallback, warningCallback);
    };

    var ajaxPost = function (url, data, callback, params, errorCallback, warningCallback) {
        ajaxBase("post", url, data, params, callback, errorCallback, warningCallback);
    };
    
    var ajaxFormPost = function(myScope, url, callback, errorCallback) {
        ajaxFormSubmit("post", myScope, url, callback, errorCallback);
    };
    
    var ajaxPut = function (url, data, callback, params, errorCallback, warningCallback) {
        ajaxBase("put", url, data, params, callback, errorCallback, warningCallback);
    };
    
    var ajaxFormSubmit = function(method, myScope, url, callback, errorCallback) {
        myScope.staticForm.$setPristine();
        myScope.message_error_info = {};
        ajaxBase(method, url, myScope.form, undefined, callback, errorCallback, function(data){
            if(data && data.code === MESSAGE_CODE.dataInvalid) {
                myScope.message_error_info = data.errors;
            }
        });
    }
    
    var ajaxFormPut = function(myScope, url, callback, errorCallback) {
        ajaxFormSubmit("put", myScope, url, callback, errorCallback);
    };
    
    return {
        init: init,
        ajaxBase: ajaxBase,
        ajaxPost: ajaxPost,
        ajaxPut: ajaxPut,
        ajaxGet: ajaxGet,
        ajaxFormPost: ajaxFormPost,
        ajaxFormPut: ajaxFormPut,
        ajaxDelete: ajaxDelete
    };
}

glanceHttp.$inject = ["$http", "$state", "$rootScope", "utils", "Notification"];
glanceApp.factory('glanceHttp', glanceHttp);
