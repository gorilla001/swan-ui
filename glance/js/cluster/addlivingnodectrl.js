function addLivingNodeCtrl(utils,$scope, $stateParams) {
    utils.clickToCopy();
    $scope.isCollapsed = false;
    $scope.clusterId = $stateParams.clusterId;
}

addLivingNodeCtrl.$inject = ['utils','$scope', '$stateParams'];
glanceApp.controller("addLivingNodeCtrl", addLivingNodeCtrl);


