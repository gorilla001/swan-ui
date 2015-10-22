glanceApp.controller("appdetailCtrl", appdetailCtrl);

appdetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp'];

function appdetailCtrl($scope, $state, $stateParams, glanceHttp) {
    $scope.deleteapp = function () {
        $scope.myConfirm("您确定要删除应用吗？", CONFRIM_DEFAULT, function () {

        });
    };

    $scope.getAppInfo = function (appId) {
        glanceHttp.ajaxGet(['app.info', {app_id: appId}], function (data) {
            $scope.appInfo = data.data;
            $scope.appState = $stateParams.appStatus;

            $scope.configObject = {
                "clusterId": $scope.appInfo.clusterId,
                "appId": parseInt($scope.appInfo.appId),
                "appName": $scope.appInfo.name,
                "ports": [],
                "envs": {}
            };
        });
    };

    $scope.getAppInfo($stateParams.appId);

    $scope.goToUpdate = function () {
        $state.go('app.update', {
            appId: $scope.appInfo.appId,
            clusterId: $scope.appInfo.clusterId,
            appname: $scope.appInfo.name,
            clustername: $scope.clusterNameMap[$scope
                .appInfo.clusterId]
        });
    };

}