function addNodeFormCtrl($rootScope, $scope, $state, $stateParams, glanceHttp, Notification) {
    
    $scope.clusterId = $stateParams.clusterId;
    $scope.nodeId = $stateParams.nodeId;

    $scope.selectedLabels = [];
    $scope.unselectedLabels = angular.copy($scope.allLabels);

    $scope.isConected = false;

    $scope.form = {
      attributes: {
        'gateway': false,
        'proxy': false,
      },
      id: $scope.nodeId,
      labels: []
    };

    $scope.attribute = 'noAttribute';
  
    $scope.msgstate = "等待主机链接......";

    $scope.message_error_info = {};
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
        'bash -c \'$(curl -Ls https://raw.githubusercontent.com/Dataman-Cloud/agent-installer/master/install-agent.sh)\' -s',
       $scope.nodeId
    );
    $scope.nodeInstallScript = cmdArray.join(' ');
    $scope.clickToCopy = function() {
      if (!$scope.afterCopy) {
          $scope.form.labels = $scope.getAllNodeLabelIds($scope.selectedLabels);
          glanceHttp.ajaxFormPost($scope, ['cluster.node', {'cluster_id': $stateParams.clusterId}], function (data) {
              $scope.afterCopy = true;
          });
      }
    };

    // 贴标签
    $scope.labeldNode = function(label) {
        $scope.selectedLabels.push(label);
        deleteLabel(label, $scope.unselectedLabels);
    };

    // 撕标签
    $scope.tearLabel = function(label, afterCopy) {
        if (!afterCopy) {
            $scope.unselectedLabels.unshift(label);
            deleteLabel(label, $scope.selectedLabels);
        } else {
            Notification.error("安装命令已生成，标签无法修改，可从该主机的主机详情页面修改。");
        }
    };

    // 新建标签
    $scope.createLabel = function(newLabelName) {
        glanceHttp.ajaxPost(['cluster.label'], {'name': newLabelName}, function(resp) {
            $scope.selectedLabels.push(resp.data);
        });
    };

    function deleteLabel(label, labels) {
        for (var i = 0; i < labels.length; i++) {
            if (label.id === labels[i].id) {
                labels.splice(i, 1);
                return labels;
            }
        }
    }
    
    // $scope.toggleLabel2Node = function(labelId) {
    //     var index = $scope.form.labels.indexOf(labelId);
    //     if (index === -1) {
    //         $scope.form.labels.push(labelId);
    //     } else {
    //         $scope.form.labels.splice(index, 1);
    //     }
    // };

    // $scope.removeLabel = function(labelId) {
    //     glanceHttp.ajaxDelete(['cluster.deleteLabel'], {'labelId': labelId}, function() {
    //         getAllLabels();
    //     });
    // };

}

addNodeFormCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'glanceHttp', 'Notification'];
glanceApp.controller('addNodeFormCtrl', addNodeFormCtrl);