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
        glanceHttp.ajaxGet("auth.notice").success(function (res) {
            $scope.noticeHtml = res.data.content;
        })
    })()

}

rootCtrl.$inject = ["$scope", "$rootScope", "$state", "glanceUser", "glanceHttp", "$window"];
glanceApp.controller("rootCtrl", rootCtrl);
