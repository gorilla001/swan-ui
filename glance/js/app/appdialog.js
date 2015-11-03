glanceApp.controller("versionDialogCtrl", versionDialogCtrl);

versionDialogCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog','Notification'];

function versionDialogCtrl($scope, $state, $stateParams, glanceHttp, ngDialog, Notification) {
    $scope.updateImageInfo = {};

    $scope.dialogOk = function(){
        $scope.updateImageInfo.appId = $scope.configObject.appId.toString();
        glanceHttp.ajaxPost(['app.updateVersion'], $scope.updateImageInfo, function (data) {
            $state.go('app.appdetail.version',undefined,{reload : true});
        }, undefined, null, function (data) {
            Notification.error('更新应用失败: ' + data.errors);
        });
        ngDialog.closeAll();

    }
}