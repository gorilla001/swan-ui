function createClusterFormCtrl($scope, $state, gHttp) {
    $scope.form = {
        clusterType: '1_master'
    };
    $scope.createCluster = function (isAddNode) {
        gHttp.Resource('cluster.clusters').post($scope.form, {'form': $scope.staticForm}).then(function () {
            if (isAddNode) {
                $state.go('cluster.nodesource', {'clusterId': data.data.id});
            } else {
                $state.go('cluster.listclusters');
            }
        })
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "gHttp"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
