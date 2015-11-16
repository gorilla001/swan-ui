function updateNodeFormCtrl($scope, $state, $stateParams, glanceHttp) {
    $scope.form = {"name": $stateParams.name, "id":$stateParams.nodeId};
    $scope.message_error_info = {};
    $scope.updateNode = function() {
        glanceHttp.ajaxFormPut($scope, ['cluster.node', {cluster_id: $stateParams.clusterId}], function() {
            $state.go("cluster.nodedetails", {"nodeId": $stateParams.nodeId, "clusterId": $stateParams.clusterId});
        });
    };
}

updateNodeFormCtrl.$inject = ["$scope", "$state", "$stateParams", "glanceHttp"];
glanceApp.controller("updateNodeFormCtrl", updateNodeFormCtrl);