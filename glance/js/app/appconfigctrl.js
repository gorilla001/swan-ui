/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appConfigCtrl", appConfigCtrl);

appConfigCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', 'Notification'];

function appConfigCtrl($scope, $rootScope, $stateParams, glanceHttp, Notification) {
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
        }, null, function(data, status){
            console.log("request failed (" + status + ")");
        }, function(data){
            Notification.error('获取配置失败 ' + $scope.addCode[data.code]);
        }, false);
    };
    $scope.listCluster().then($scope.getConfig);
}
