function addNodeCtrl($scope, $stateParams, gHttp) {
  $scope.clusterId = $stateParams.clusterId;
  var init = function() {
    gHttp.Resource("cluster.nodeId", {cluster_id: $stateParams.clusterId}).get().then(function(data){
        $scope.nodeId = data.identifier;
    })
  };
  init();
}

addNodeCtrl.$inject = ['$scope', '$stateParams', 'gHttp'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);
