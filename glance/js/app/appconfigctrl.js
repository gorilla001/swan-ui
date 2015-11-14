/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appConfigCtrl", appConfigCtrl);

appConfigCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appConfigCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appConfig";

    $scope.getConfig = function(){
        glanceHttp.ajaxGet(['app.config',{app_id: $stateParams.appId}], function (data) {
            $scope.config = data.data;
        });
    };

    $scope.portType = {
        "1": "对内 TCP",
        "2": "对外 TCP",
        "3": "对外标准 HTTP",
        "4": "对内 HTTP",
        "5": "对外 HTTP"
    };

    $scope.getConfig();
}
