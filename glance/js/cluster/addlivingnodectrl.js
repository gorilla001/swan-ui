function addLivingNodeCtrl(utils,$scope, $stateParams) {
    $scope.isCollapsed = true;
    $scope.clusterId = $stateParams.clusterId;
}

addLivingNodeCtrl.$inject = ['utils','$scope', '$stateParams'];
glanceApp.controller("addLivingNodeCtrl", addLivingNodeCtrl);