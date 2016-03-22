function addNodeCtrl($scope, $stateParams, nodeInfo) {
  $scope.clusterId = $stateParams.clusterId;
  $scope.nodeId = nodeInfo.identifier;
}

addNodeCtrl.$inject = ['$scope', '$stateParams', 'nodeInfo'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);
