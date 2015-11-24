function updateClusterFormCtrl($scope, $state, $stateParams, glanceHttp) {
    $scope.form = {
        "id": $stateParams.clusterId,
        "name": $stateParams.name
    };
    $scope.message_error_info = {};
    $scope.updateCluster = function() {
        glanceHttp.ajaxFormPut($scope, ['cluster.cluster'], function() {
            $state.go("cluster.clusterdetails.nodes", {"clusterId": $stateParams.clusterId});
        });
    };
}

updateClusterFormCtrl.$inject = ["$scope", "$state", "$stateParams", "glanceHttp"];
glanceApp.controller("updateClusterFormCtrl", updateClusterFormCtrl);
