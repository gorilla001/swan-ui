function createClusterFormCtrl($scope, $state, gHttp, userBackend) {
    $scope.form = {
        clusterType: '1_master',
        groupId: ""
    };

    $scope.groups = [];
    
    userBackend.listGroups().then(function(data) {
        angular.forEach(data.groups, function (group) {
            if (group.role.id == 1){
                $scope.groups.push(group);
            }
        })
    });
    $scope.createCluster = function (isAddNode) {
        var data = {name: $scope.form.name,
                clusterType: $scope.form.clusterType}
        if ($scope.form.groupId) {
            data.groupId = parseInt($scope.form.groupId);
        }
        gHttp.Resource('cluster.clusters').post(data, {'form': $scope.staticForm}).then(function (data) {
            if (isAddNode) {
                $state.go('cluster.nodesource', {'clusterId': data.id});
            } else {
                $state.go('cluster.detail.nodes', {clusterId: data.id});
            }
        })
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "gHttp", "userBackend"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
