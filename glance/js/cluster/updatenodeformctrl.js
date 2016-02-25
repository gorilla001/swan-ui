function updateNodeFormCtrl($scope, $state, $stateParams, gHttp) {
    $scope.form = {"name": $stateParams.name};
    $scope.updateNode = function() {
        gHttp.Resource('cluster.node', {"cluster_id": $stateParams.clusterId, "node_id": $stateParams.nodeId}).
            put($scope.form, {'form': $scope.staticForm}).then(function () {
                $state.go("cluster.nodedetails", {"nodeId": $stateParams.nodeId, "clusterId": $stateParams.clusterId});
            });
    };
}

updateNodeFormCtrl.$inject = ["$scope", "$state", "$stateParams", "gHttp"];
glanceApp.controller("updateNodeFormCtrl", updateNodeFormCtrl);