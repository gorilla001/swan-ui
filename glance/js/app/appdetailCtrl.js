glanceApp.controller("appdetailCtrl", appdetailCtrl);

appdetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog'];

function appdetailCtrl($scope, $state, $stateParams, glanceHttp, ngDialog) {
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

    $scope.openDialog = function () {
        ngDialog.open({
            template: '../../views/app/updateVersionDialog.html',
            controller: 'versionDialogCtrl',
            scope: $scope});
    };

    $scope.getAppInfo($stateParams.appId);
}