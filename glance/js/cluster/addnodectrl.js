function addNodeCtrl($scope, $stateParams, glanceHttp) {
  $scope.clusterId = $stateParams.clusterId;
  var init = function() {
    glanceHttp.ajaxGet(["cluster.nodeId", {cluster_id: $stateParams.clusterId}], function(data){
      $scope.nodeId = data.data.identifier;
    });
  };
  init();
}

addNodeCtrl.$inject = ['$scope', '$stateParams', 'glanceHttp'];
glanceApp.controller("addNodeCtrl", addNodeCtrl);
