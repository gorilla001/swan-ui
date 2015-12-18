function rootCtrl($scope, $rootScope, $state, glanceUser, glanceHttp) {
    glanceUser.init();
    $scope.myConfirm = function (msg, callback) {
        $scope._confirmMsg = msg;
        $scope._confirmCallback = callback;
        $('#confirmModal').modal("show");
    };
    
    glanceHttp.ajaxGet(["auth.user"], function (data) {
        $rootScope.userName = data.data["userName"];
        $rootScope.userId = data.data["userId"];
        $rootScope.isSuperuser = data.data["isSuperuser"];
        $rootScope.latestVersion = data.data["latestVersion"]
    });

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
}

rootCtrl.$inject = ["$scope", "$rootScope", "$state", "glanceUser", "glanceHttp"];
glanceApp.controller("rootCtrl", rootCtrl);
