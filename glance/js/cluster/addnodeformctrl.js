function addNodeFormCtrl($scope, $state, $stateParams, gHttp, Notification, labelService, addNodeLabelModal) {
    
    $scope.clusterId = $stateParams.clusterId;
    $scope.nodeId = $stateParams.nodeId;

    $scope.selectedLabels = [];
    $scope.unselectedLabels = [];
    $scope.allLabelNames = [];
    $scope.labelForm = {};
    
    $scope.node = {
            cluster: {group_role: ''}
         }

    $scope.isConected = false;

    $scope.form = {
      id: $scope.nodeId,
      labels: []
    };

    $scope.msgstate = "等待主机链接......";

    $scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
      if(data['nodeId'] == $scope.nodeId && data['status'] != 'terminated') {
        $scope.isConected = true;
        $scope.msgstate = '主机连接成功，系统初始化中，这可能需要一段时间，您可以离开本页面去执行其他操作。';
      }
    });
    $scope.addNode = function(isCon) {
        if (isCon) {
            $state.go('cluster.nodesource', {
                'clusterId':$stateParams.clusterId
            });
        } else {
            $state.go('cluster.clusterdetails.nodes', {
                'clusterId':$stateParams.clusterId
            });
        }
    };
    
    var cmdArray = new Array(
        'sudo -H',
        AGENT_CONFIG.dmHost,
        'OMEGA_ENV=' + RUNNING_ENV,
        'bash -c \"$(curl -Ls ' + AGENT_CONFIG.installUrl + ')\" -s',
       $scope.nodeId
    );
    $scope.nodeInstallScript = cmdArray.join(' ');
    $scope.clickToCopy = function() {
        if (!$scope.afterCopy) {
            $scope.form.labels = $scope.getAllNodeLabelIds($scope.selectedLabels, 'id');
            gHttp.Resource('cluster.nodes', {'cluster_id': $stateParams.clusterId}).post($scope.form, {'form': $scope.staticForm}).then(function () {
                $scope.afterCopy = true;
            })
        }
    };

    $scope.changeLabels = function() {
        labelService.changeLabels($scope)
            .then(function() {
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
            });
    };

    $scope.labelledNode = function(label) {
        labelService.labelledNode(label, $scope);
    };

    $scope.createLabel = function() {
        labelService.createLabel($scope);
    };

    $scope.tearLabel = function(label, afterCopy) {
        if (!afterCopy) {
            labelService.tearLabel(label, $scope);
        } else {
            Notification.warning('安装命令已生成，标签无法修改，可从该主机的主机详情页面修改。');
        }
    };

    $scope.deleteLabel = function(label) {
        labelService.deleteLabel(label, $scope);
    };
    
    $scope.showAddNodeLabelModal = function($event) {
        labelService.changeLabels($scope)
            .then(function() {
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
                // FIX(mgniu): I have to pass the $scope to modal, this is not the good way!!!
                addNodeLabelModal.open('/views/cluster/node-label-modal.html', $event,$scope);
            });
    };
}

addNodeFormCtrl.$inject = ['$scope', '$state', '$stateParams', 'gHttp', 'Notification', 'labelService', 'addNodeLabelModal'];
glanceApp.controller('addNodeFormCtrl', addNodeFormCtrl);
