function updateNodeCtrl($scope, $stateParams) {
    $scope.clusterId = $stateParams.clusterId;
    $scope.nodeId = $stateParams.nodeId;
}

updateNodeCtrl.$inject = ["$scope", "$stateParams"];
glanceApp.controller("updateNodeCtrl", updateNodeCtrl);