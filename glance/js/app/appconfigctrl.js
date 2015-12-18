/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appConfigCtrl", appConfigCtrl);

appConfigCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appConfigCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appConfig";
    $scope.networkText = {
        BRIDGE: "网桥模式",
        HOST: "HOST 模式"
    };

    $scope.getConfig = function () {
        glanceHttp.ajaxGet(['app.config', {app_id: $stateParams.appId}], function (data) {
            $scope.config = data.data;
            //appdetail status depend on config, so when config changed,you should call getAppInfo
            $scope.getAppInfo($stateParams.appId);

            if ($scope.config.ClusterId) {
                $scope.getNode($scope.config.ClusterId);
            }
        });
    };

    $scope.getConfig();
}
