function addLivingNodeCtrl(utils,$scope, $stateParams) {
    utils.clickToCopy();
    $scope.isCollapsed = true;
    $scope.clusterId = $stateParams.clusterId;
}

addLivingNodeCtrl.$inject = ['utils','$scope', '$stateParams'];
glanceApp.controller("addLivingNodeCtrl", addLivingNodeCtrl);