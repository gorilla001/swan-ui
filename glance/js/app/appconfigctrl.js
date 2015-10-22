/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appConfigCtrl", appConfigCtrl);

appConfigCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appConfigCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appConfig";
    $scope.memSize = {
        1: "512 MB",
        2: "1 GB ",
        3: "2 GB"
    };

    $scope.getConfig = function(){
        glanceHttp.ajaxGet(['app.config',{app_id: $stateParams.appId}], function (data) {
            $scope.config = data.data;
        });
    };

    $scope.getConfig();
}
