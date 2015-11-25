/**
 * Created by my9074 on 15/11/24.
 */
glanceApp.controller("ModalDirCtrl", ModalDirCtrl);

ModalDirCtrl.$inject = ['$scope', '$uibModalInstance'];

function ModalDirCtrl($scope, $uibModalInstance){
    $scope.ok = function () {
        $scope.addDirInfo($scope.dirInfo);
        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}