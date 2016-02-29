function createClusterFormCtrl($scope, $state, gHttp) {
    $scope.form = {
        clusterType: '1_master'
    };
    $scope.createCluster = function (isAddNode) {
        gHttp.Resource('cluster.clusters').post($scope.form, {'form': $scope.staticForm}).then(function (data) {
            if (isAddNode) {
                $state.go('cluster.nodesource', {'clusterId': data.id});
            } else {
                $state.go('cluster.listclusters');
            }
        })
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "gHttp"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
