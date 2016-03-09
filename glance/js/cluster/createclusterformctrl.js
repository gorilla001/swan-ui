function createClusterFormCtrl($scope, $state, gHttp, userBackend) {
    $scope.form = {
        clusterType: '1_master'
    };
    userBackend.listGroups().then(function(data) {
        $scope.groups=data.groups;
    });
    $scope.createCluster = function (isAddNode) {
        if (!$scope.form.groupId) {
            delete $scope.form.groupId;
        } else {
            $scope.form.groupId = parseInt($scope.form.groupId)
        }
        gHttp.Resource('cluster.clusters').post($scope.form, {'form': $scope.staticForm}).then(function (data) {
            if (isAddNode) {
                $state.go('cluster.nodesource', {'clusterId': data.id});
            } else {
                $state.go('cluster.listclusters');
            }
        })
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "gHttp", "userBackend"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
