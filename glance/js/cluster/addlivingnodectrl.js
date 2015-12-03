function addLivingNodeCtrl(utils,$scope) {
    utils.clickToCopy();
    $scope.isCollapsed = false;
}

addLivingNodeCtrl.$inject = ['utils','$scope'];
glanceApp.controller("addLivingNodeCtrl", addLivingNodeCtrl);


