/**
 * Created by my9074 on 15/11/23.
 */
glanceApp.controller('ModalPortCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $scope.addPortInfo($scope.portInfo);
        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});