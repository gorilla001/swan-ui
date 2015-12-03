function iaasQcloudCtrl($scope, $stateParams) {
  $scope.clusterId = $stateParams.clusterId;
  $scope.nodeId = $stateParams.nodeId;
  $scope.skip = {'step': 1};
}

iaasQcloudCtrl.$inject = ['$scope', '$stateParams'];
glanceApp.controller("iaasQcloudCtrl", iaasQcloudCtrl);
