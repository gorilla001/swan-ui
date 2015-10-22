function createClusterFormCtrl($scope, $state, glanceHttp) {
    $scope.form = {
        clusterType: '1_master'
    };
    $scope.message_error_info = {};
    $scope.createCluster = function (isAddNode) {
        glanceHttp.ajaxFormPost($scope, ['cluster.createCluster'], function (data) {
            if (isAddNode) {
                $state.go('cluster.addnode', {'clusterId': data.data.id});
            } else {
                $state.go('cluster.listclusters');
            }
        });
    };
}

createClusterFormCtrl.$inject = ["$scope", "$state", "glanceHttp"];
glanceApp.controller("createClusterFormCtrl", createClusterFormCtrl);
