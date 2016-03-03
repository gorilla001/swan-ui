/**
 * Created by my9074 on 15/12/28.
 */
glanceApp.controller("ModalContainerCtrl", ModalContainerCtrl);

ModalContainerCtrl.$inject = ['$scope', '$uibModalInstance', 'appCurd', 'Notification', '$state', 'modalResolve'];

function ModalContainerCtrl($scope, $uibModalInstance, appCurd, Notification, $state, modalResolve) {

    $scope.appInfo = modalResolve;
    $scope.containerNum = $scope.appInfo.containerNum;

    $scope.ok = function () {
        var updateContainerText = "";
        var updateContainerErrorText = "";
        if ($scope.appInfo.containerNum < $scope.containerNum) {
            updateContainerText = " 扩容中";
            updateContainerErrorText = " 扩容失败 ";
        } else {
            updateContainerText = " 缩容中";
            updateContainerErrorText = " 缩容失败 ";
        }
        appCurd.updateAjax($scope.appInfo.appId, $scope.containerNum, $scope.appInfo.appName).then(
            function (data) {
                Notification.success('应用 ' + $scope.appInfo.appName + updateContainerText);
                $state.reload();
            }, function (data) {
                Notification.error('应用 ' + $scope.appInfo.appName + updateContainerErrorText);
            }
        );

        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
