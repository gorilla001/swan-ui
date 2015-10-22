function adminCtrl($scope, $rootScope, glanceHttp) {
    $rootScope.show = "admin";
    
    $scope.createInvitationCodes = function () {
        glanceHttp.ajaxGet(["auth.createInvitationCodes", {num: 10}], function (data) {
            alert(data.data.join(" "));
        })
    }
    
    glanceHttp.ajaxGet(["auth.listUsers"], function (data) {
        $scope.users = data.data;
    });

}

adminCtrl.$inject = ["$scope", "$rootScope", "glanceHttp"];
glanceApp.controller('adminCtrl', adminCtrl);
