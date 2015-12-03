function iaasProviderCtrl($scope, $stateParams) {
  $scope.clusterId = $stateParams.clusterId;
  $scope.nodeId = $stateParams.nodeId;
}

iaasProviderCtrl.$inject = ['$scope', '$stateParams'];
glanceApp.controller("iaasProviderCtrl", iaasProviderCtrl);
