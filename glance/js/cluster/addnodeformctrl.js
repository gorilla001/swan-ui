function addNodeFormCtrl($rootScope, $scope, $state, $stateParams, glanceHttp) {
    $scope.isConected = false;
    $scope.form = {
      attributes: {'transient': true}
    };
    $scope.msgstate = "等待主机链接......";
    $scope.message_error_info = {};
    $scope.addNode = function(isCon) {
        glanceHttp.ajaxFormPost($scope, ["cluster.updateNode"], function() {
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
                BACKEND_URL.agentConfig.version,
                BACKEND_URL.agentConfig.filesUrl,
               "sh -s",
               data.data.identifier
            );
            $scope.nodeInstallScript = cmdArray.join(' ');
            $scope.$on("nodeStatusUpdate-" + $scope.nodeId, function (event, data) {
                if (data["status"] == "running") {
                    $scope.isConected = true;
                    $scope.msgstate = "主机连接成功，系统初始化中，这可能需要一段时间，您可以离开本页面去执行其他操作。";

                }
            });
        });
    };
    init();
}

addNodeFormCtrl.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "glanceHttp"];
glanceApp.controller('addNodeFormCtrl', addNodeFormCtrl);
