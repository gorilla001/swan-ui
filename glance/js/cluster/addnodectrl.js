function addNodeCtrl(utils,$scope) {
    utils.clickToCopy();
    $scope.isCollapsed = true;
}

addNodeCtrl.$inject = ['utils','$scope'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);


