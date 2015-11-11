function rootCtrl($scope, $rootScope, glanceUser, glanceHttp) {
    glanceUser.init();
    $scope.myConfirm = function (msg, callback, showMore) {
        $scope._confirmMsg = msg;
        $scope._confirmCallback = callback;
        $('#confirmModal').modal("show");
        if (showMore) {
            $scope.deleteCluster = true;
        } else {
            $scope.deleteCluster = false;
        }
    };
    
    glanceHttp.ajaxGet(["auth.getMe"], function (data) {
        $rootScope.userName = data.data["userName"];
        $rootScope.userId = data.data["userId"];
        $rootScope.isSuperuser = data.data["isSuperuser"];
        if($rootScope.isSuperuser) {
            $(".super-user").css("display", "block")
        }
    });
    
    $scope.getCSUrl = function () {
        var w = window.open();
        glanceHttp.ajaxGet(["auth.getCSUrl"], function(data){
            w.location = data.data.url;
        });
    };
    
    $scope.logout = function(){
        glanceHttp.ajaxGet(["auth.logout"], function(data){
            glanceUser.clear();
            window.location.href = BACKEND_URL.userUrl;
        });
    };
}

rootCtrl.$inject = ["$scope", "$rootScope", "glanceUser", "glanceHttp"];
glanceApp.controller("rootCtrl", rootCtrl);

