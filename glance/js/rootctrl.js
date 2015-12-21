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
        
        //GrowingIO
        if (RUNNING_ENV === "prod") {
            (function(){ 
                _vds.push(['setAccountId', '0edf12ee248505950b0a77b02d47c537']); 
                _vds.push(['setCS1', 'user_id',  data.data["userId"].toString()]);
                (function() {
                    var vds = document.createElement('script'); 
                    vds.type='text/javascript'; vds.async = true;
                    vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(vds, s);
                })();
            })();
        }
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
