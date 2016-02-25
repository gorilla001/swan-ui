function updateClusterFormCtrl($scope, $state, $stateParams, gHttp) {
    $scope.form = {
        "name": $stateParams.name
    };
    $scope.updateCluster = function() {
        gHttp.Resource('cluster.cluster', {'cluster_id': $stateParams.clusterId}).
            put($scope.form, {'form': $scope.staticForm}).then(function () {
                $state.go("cluster.clusterdetails.nodes", {"clusterId": $stateParams.clusterId});
            })
    };

    $scope.goback = function(){
        history.back();
    }
}

updateClusterFormCtrl.$inject = ["$scope", "$state", "$stateParams", "gHttp"];
glanceApp.controller("updateClusterFormCtrl", updateClusterFormCtrl);
