function addNodeCtrl($scope, $stateParams, gHttp, nodeInfo) {
  $scope.clusterId = $stateParams.clusterId;
  $scope.nodeId = nodeInfo.identifier;
}

addNodeCtrl.$inject = ['$scope', '$stateParams', 'gHttp', 'nodeInfo'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);
