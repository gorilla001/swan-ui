/*@ngInject*/
function updateNodeFormCtrl($scope, $state, $stateParams, gHttp, labelService, addNodeLabelModal) {
    
    gHttp.Resource('cluster.node', {cluster_id: $stateParams.clusterId, node_id: $stateParams.nodeId}).
        get().then(function (data) {
            $scope.node = data;
            $scope.selectedLabels = labelService.formatNodeLabels(data.node_labels);
            $scope.unselectedLabels = [];
            $scope.form = {"name": $scope.node.name};
    });
    
    $scope.showAddNodeLabelModal = function($event) {
        labelService.changeLabels($scope)
            .then(function() {
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
                // FIX(mgniu): I have to pass the $scope to modal, this is not the good way!!!
                addNodeLabelModal.open('/views/cluster/node-label-modal.html', $event,$scope);
            });
    };
    
    $scope.updateNode = function() {
        $scope.form.labels = $scope.getAllNodeLabelIds($scope.selectedLabels, 'id');
        gHttp.Resource('cluster.node', {"cluster_id": $stateParams.clusterId, "node_id": $stateParams.nodeId}).
            put($scope.form, {'form': $scope.staticForm}).then(function () {
                $state.go("cluster.nodedetails", {"nodeId": $stateParams.nodeId, "clusterId": $stateParams.clusterId});
            });
    };
}

glanceApp.controller("updateNodeFormCtrl", updateNodeFormCtrl);