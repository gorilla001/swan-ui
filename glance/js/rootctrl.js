function rootCtrl($scope, $rootScope, $state, glanceUser, glanceHttp, $window) {
    $rootScope.myConfirm = function (msg, callback) {
        $scope._confirmMsg = msg;
        $scope._confirmCallback = callback;
        $('#confirmModal').modal("show");
    };

    // app list request params
    $rootScope.appListParams = {
        searchKeyWord:'',
        page: 1,  //current page index
        count: 10, // current count
        //sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
    };

    if(IS_OFF_LINE){
        $scope.userManualUrl = "http://offlinedoc.shurenyun.com/";
    }else{
        $scope.userManualUrl = "http://doc.shurenyun.com";
    }
    
    $scope.getCSUrl = function () {
        var w = window.open();
        glanceHttp.ajaxGet("auth.customerservice", function(data){
            w.location = data.data.url;
        });
    };
    
    $scope.logout = function(){
        glanceHttp.ajaxDelete(["auth.auth"], function(data){
            glanceUser.clear();
            window.location.href = USER_URL;
        });
    };

    $scope.goBack = function() {
        $window.history.back();
    };

    //set Notice Alert if has notice
    (function () {
        glanceHttp.ajaxGet("auth.notice")
            .success(function (res) {
                if(res.data && res.data.content){
                    $scope.noticeHtml = res.data.content;
                }
            })
            .error(function (res, status) {
                console.log("Notice ajax error, request failed (" + status + ")")
            })
    })()

}

rootCtrl.$inject = ["$scope", "$rootScope", "$state", "glanceUser", "glanceHttp", "$window"];
glanceApp.controller("rootCtrl", rootCtrl);
