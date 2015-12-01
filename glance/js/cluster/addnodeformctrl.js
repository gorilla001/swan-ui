function addNodeFormCtrl($rootScope, $scope, $state, $stateParams, glanceHttp, Notification) {
    $scope.clusterId = $stateParams.clusterId;
    $scope.nodeId = $stateParams.nodeId;
    $scope.isConected = false;
    $scope.form = {
      attributes: {
                    'transient': true,
                    'gateway': false,
                    'proxy': false,
                    'persistent': false
                  },
      id: $scope.nodeId
    };
    $scope.msgstate = "等待主机链接......";
    $scope.message_error_info = {};
    $scope.$on("nodeStatusUpdate", function (event, data) {
      if(data["nodeId"] == $scope.nodeId && data["status"] != "terminated") {
        $scope.isConected = true;
        $scope.msgstate = "主机连接成功，系统初始化中，这可能需要一段时间，您可以离开本页面去执行其他操作。";
      }
    });
    $scope.addNode = function(isCon) {
        glanceHttp.ajaxFormPost($scope, ["cluster.node", {"cluster_id": $stateParams.clusterId}], function() {
            if (isCon) {
                $state.go('cluster.nodesource', {
                    'clusterId':$stateParams.clusterId
                });
            } else {
                $state.go('cluster.clusterdetails.nodes', {
                    'clusterId':$stateParams.clusterId
                });
            }
        });
    };
    var cmdArray = new Array(
        "sudo -H",
        AGENT_CONFIG.dmHost,
        "OMEGA_ENV=" + RUNNING_ENV,
        "bash -c \"$(curl -Ls https://raw.githubusercontent.com/Dataman-Cloud/agent-installer/master/install-agent.sh)\" -s",
       $scope.nodeId
    );
    $scope.nodeInstallScript = cmdArray.join(' ');
    $scope.clickToCopy = function() {
      if (!$scope.afterCopy) {
          glanceHttp.ajaxFormPost($scope, ["cluster.node", {"cluster_id": $stateParams.clusterId}], function (data) {
              $scope.afterCopy = true;
          });
      }
    }
    
    $scope.onAttributesChange = function(attribute) {
        for (var attr_name in $scope.form.attributes) {
            if ($scope.form.attributes[attr_name]) {
                return;
            }
        }
        $scope.form.attributes[attribute] = true;
        Notification.error('必须选择至少一项主机类型');
        
    }

}

addNodeFormCtrl.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "glanceHttp", "Notification"];
glanceApp.controller('addNodeFormCtrl', addNodeFormCtrl);
