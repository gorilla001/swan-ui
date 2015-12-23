glanceApp.controller("versionDialogCtrl", versionDialogCtrl);

versionDialogCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog','Notification', '$timeout'];

function versionDialogCtrl($scope, $state, $stateParams, glanceHttp, ngDialog, Notification, $timeout) {
    $scope.updateImageInfo = {};

    $scope.dialogOk = function(appName){
        $scope.updateImageInfo.appId = $scope.configObject.appId.toString();
        glanceHttp.ajaxPost(['app.updateVersion'], $scope.updateImageInfo, function (data) {
            Notification.success('应用 '+ appName +' 更新中...');
            $scope.$emit("checkIsDeploy");
            $state.go('app.appdetail.version',{appId: $scope.configObject.appId},{reload : true});
        }, undefined, null, function (data) {
            Notification.error('应用 '+ appName +' 更新失败: ' + $scope.addCode[data.code]);
        });
        ngDialog.closeAll();

    };
}