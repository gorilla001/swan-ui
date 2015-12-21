/**
 * Created by my9074 on 15/11/23.
 */
glanceApp.controller("ModalPortCtrl", ModalPortCtrl);

ModalPortCtrl.$inject = ['$scope', '$uibModalInstance'];

function ModalPortCtrl($scope, $uibModalInstance) {

    var pattern = /500[1-9]|50[1-9][0-9]|5100|1[0-9][0-9][0-9][0-9]|20000|31[0-9][0-9][0-9]|32000/;

    $scope.invalidPort = function (portInfo) {
        return pattern.test(portInfo.mapPort) || $scope.portOccupied(portInfo);
    };

    $scope.ok = function () {
        $scope.addPortInfo($scope.portInfo);
        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}