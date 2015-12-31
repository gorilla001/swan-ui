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

            if ($scope.config.clusterId) {
                $scope.getNode($scope.config.clusterId);
            }
        });
    };
    $scope.listCluster().then($scope.getConfig);
}
