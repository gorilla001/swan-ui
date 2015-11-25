/**
 * Created by my9074 on 15/11/24.
 */
glanceApp.controller("ModalPathCtrl", ModalPathCtrl);

ModalPathCtrl.$inject = ['$scope', '$uibModalInstance'];

function ModalPathCtrl($scope, $uibModalInstance){
    $scope.ok = function () {
        $scope.addPathInfo($scope.pathInfo);
        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}