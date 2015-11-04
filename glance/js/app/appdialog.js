glanceApp.controller("versionDialogCtrl", versionDialogCtrl);

versionDialogCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog','Notification'];

function versionDialogCtrl($scope, $state, $stateParams, glanceHttp, ngDialog, Notification) {
    $scope.updateImageInfo = {};

    $scope.dialogOk = function(appName){
        $scope.updateImageInfo.appId = $scope.configObject.appId.toString();
        glanceHttp.ajaxPost(['app.updateVersion'], $scope.updateImageInfo, function (data) {
            Notification.success('应用 '+ appName +' 更新成功...');
            $state.go('app.appdetail.version',undefined,{reload : true});
        }, undefined, null, function (data) {
            Notification.error('应用 '+ appName +' 更新失败: ' + data.errors);
        });
        ngDialog.closeAll();

    }
}