glanceApp.controller("appdetailCtrl", appdetailCtrl);

appdetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog','$timeout','Notification'];

function appdetailCtrl($scope, $state, $stateParams, glanceHttp, ngDialog, $timeout, Notification) {
    var promise;
    var IS_NOT_DEPLOYING = 0;
    var IS_DEPLOYING = 1;

    $scope.getAppInfo = function (appId) {
        glanceHttp.ajaxGet(['app.info', {app_id: appId}], function (data) {
            $scope.appInfo = data.data;
            $scope.appState = $stateParams.appStatus;

                $scope.configObject = {
                "clusterId": $scope.appInfo.clusterId,
                "appId": parseInt($scope.appInfo.appId),
                "appName": $scope.appInfo.name
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

    $scope.$on("checkIsDeploy", function () {
        $scope.isDeploy()
    });

    $scope.isDeploy = function(){
        glanceHttp.ajaxGet(['app.isdeploying',{app_id: $stateParams.appId}], function (data) {
            $scope.isDeployState = data.data.isdeploying;
            if($scope.isDeployState === IS_NOT_DEPLOYING){
                if(data.data.info !== ""){
                    Notification.warning(data.data.info);
                }
                promise = $timeout($scope.isDeploy, 10000);
            }else if($scope.isDeployState === IS_DEPLOYING){
                $state.go('app.appdetail.version',{appId: $scope.configObject.appId},{reload : true});
            }
        }, undefined, null, function(data) {

        });
    };

    $scope.$on('$destroy', function () {
        $timeout.cancel(promise);
    });
}