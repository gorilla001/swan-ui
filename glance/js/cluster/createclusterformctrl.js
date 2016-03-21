function createClusterFormCtrl($scope, $state, gHttp, userBackend) {
    $scope.form = {
        clusterType: '1_master'
    };
    
    $scope.groups = []
    userBackend.listGroups().then(function(data) {
        angular.forEach(data.groups, function (group) {
            if (group.role.id == 1){
                $scope.groups.push(group);
            }
        })
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
                $state.go('cluster.clusterdetails.nodes', {clusterId: data.id});
            }
        })
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "gHttp", "userBackend"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
