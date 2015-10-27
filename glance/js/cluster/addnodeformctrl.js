function addNodeFormCtrl($rootScope, $scope, $state, $stateParams, glanceHttp) {
    $scope.isConected = false;
    $scope.form = {};
    $scope.msgstate = "等待主机链接......";
    $scope.message_error_info = {};
    $scope.addNode = function(isCon){
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
                "curl -Ls https://raw.githubusercontent.com/Dataman-Cloud/agent-installer/master/install-agent.sh | sudo -H",
                BACKEND_URL.agentConfig.dm_host,
                BACKEND_URL.agentConfig.files_url,
               "sh -s",
               data.data.identifier
            );
            $scope.nodeInstallScript = cmdArray.join(' ');
            $scope.$on("nodeStatusUpdate-" + $scope.nodeId, function (event, data) {
                if (data["status"] == "running") {
                    $scope.isConected = true;
                    $scope.msgstate = "您的主机链接成功!";

                }
            });
        });
    };
    init();
}

addNodeFormCtrl.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "glanceHttp"];
glanceApp.controller('addNodeFormCtrl', addNodeFormCtrl);


