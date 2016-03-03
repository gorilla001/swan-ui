function rootCtrl($scope, $rootScope, $state, glanceUser, gHttp, $window, appcurd) {
    $rootScope.myConfirm = function (msg, callback) {
        $scope._confirmMsg = msg;
        $scope._confirmCallback = callback;
        $('#confirmModal').modal("show");
    };

    // app list request params
    $rootScope.appListParams = {
        searchKeyWord:'',
        page: 1,  //current page index
        count: 20, // current count
        //sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
    };

    if(IS_OFF_LINE){
        $scope.userManualUrl = "http://offlinedoc.shurenyun.com/";
    }else{
        $scope.userManualUrl = "http://doc.shurenyun.com";
    }
    
    $scope.getCSUrl = function () {
        var w = window.open();
        gHttp.Resource("auth.customerservice").get().then(function (data) {
            w.location = data.url;
        })
    };

    $scope.logout = function(){
        gHttp.Resource("auth.auth").delete().then(function(){
            glanceUser.clear();
            window.location.href = USER_URL+"?timestamp="+new Date().getTime();;
        });
    };

    $scope.goBack = function() {
        $window.history.back();
    };

    /*
        扩展实例(公用)
     */
    $scope.upContainNum = function (instances) {
        var data = {instances: instances};
        appcurd.updateContainer(data, $rootScope.upContainerAppInfo.cluster_id, $rootScope.upContainerAppInfo.app_id)
    };

    //set Notice Alert if has notice
    (function () {
        gHttp.Resource("auth.notice").get().then(function (data) {
            if(data){
                $scope.noticeHtml = data.content;
            }
        }).catch(function() {
            console.log("Notice ajax error");
        })
    })()

}

rootCtrl.$inject = ["$scope", "$rootScope", "$state", "glanceUser", "gHttp", "$window", "appcurd"];
glanceApp.controller("rootCtrl", rootCtrl);
