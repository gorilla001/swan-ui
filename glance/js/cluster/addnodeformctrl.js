function addNodeFormCtrl($rootScope, $scope, $state, $stateParams, glanceHttp, Notification) {
    $scope.isConected = false;
    $scope.form = {
      attributes: {'transient': true,
          'gateway': false,
          'proxy': false,
          'persistent': false}
    };
    $scope.msgstate = "等待主机链接......";
    $scope.message_error_info = {};
    $scope.addNode = function(isCon) {
        glanceHttp.ajaxFormPut($scope, ["cluster.node", {"cluster_id": $stateParams.clusterId}], function() {
            if (isCon) {
                $state.reload();
            } else {
                $state.go('cluster.clusterdetails.nodes' ,{
                    'clusterId':$stateParams.clusterId
                });
            }
        });
    };
    var init = function() {
        glanceHttp.ajaxGet(["cluster.getNodeID", {cluster_id: $stateParams.clusterId}], function(data){
            $scope.nodeId = data.data.identifier;
            $scope.form.id = $scope.nodeId;
            var cmdArray = new Array(
                BACKEND_URL.agentConfig.installScript,
                BACKEND_URL.agentConfig.dmHost,
                "OMEGA_AGENT_VERSION=" + $scope.agentVersionLatest,
                BACKEND_URL.agentConfig.filesUrl,
               "sh -s",
               data.data.identifier
            );
            $scope.nodeInstallScript = cmdArray.join(' ');
            $scope.$on("nodeStatusUpdate-" + $scope.nodeId, function (event, data) {
                if (data["status"] === "running") {
                    $scope.isConected = true;
                    $scope.msgstate = "主机连接成功，系统初始化中，这可能需要一段时间，您可以离开本页面去执行其他操作。";

                }
            });
        });
    };
    init();

    $scope.clickToCopy = function() {
      $scope.isHintHide = false;
      $scope.afterCopy = true;
      glanceHttp.ajaxFormPost($scope, ["cluster.node", {"cluster_id": $stateParams.clusterId}]);
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
