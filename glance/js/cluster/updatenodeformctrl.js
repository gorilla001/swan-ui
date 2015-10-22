function updateNodeFormCtrl($scope, $state, $stateParams, glanceHttp) {
    $scope.form = {"name": $stateParams.name, "id":$stateParams.nodeId};
    $scope.message_error_info = {};
    $scope.updateNode = function() {
        glanceHttp.ajaxFormPost($scope, ['cluster.updateNode'], function() {
            $state.go("cluster.nodedetails", {"nodeId": $stateParams.nodeId});
        });
    };
}

updateNodeFormCtrl.$inject = ["$scope", "$state", "$stateParams", "glanceHttp"];
glanceApp.controller("updateNodeFormCtrl", updateNodeFormCtrl);