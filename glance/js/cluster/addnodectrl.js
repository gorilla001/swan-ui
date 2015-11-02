function addNodeCtrl(utils,$scope) {
    utils.clickToCopy();
    $scope.isCollapsed = false;
}

addNodeCtrl.$inject = ['utils','$scope'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);


