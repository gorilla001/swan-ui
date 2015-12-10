function clusterDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, Notification) {

    $scope.statusCache = {};
    function getCurCluster() {
        glanceHttp.ajaxGet(["cluster.clusterIns", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.cluster = data.data;
            $scope.totalItems = $scope.cluster.nodes.length;
            $scope.pageLength = 20;
            $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;

            $scope.currentPage = 1;
            var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus($scope.cluster.nodes, $scope.cluster.id, $scope.statusCache);
            angular.forEach($scope.cluster.nodes, function(node) {
                $scope.statusCache[$scope.cluster.id]["nodes"][node.id].isUpgradeFailed = node.is_upgrade_failed;
            });
            $scope.startListenStatusUpdate($scope, $scope.statusCache);
            $scope.$on(SUB_INFOTYPE.agentUpgradeFailed, function (event, data) {
                if (data["clusterId"] == $scope.cluster.id) {
                    $scope.statusCache[$scope.cluster.id]["nodes"][data["nodeId"]].isUpgradeFailed = true;
                }
            });
            $scope.contentPage = [];
            $.each(nodesWithRoleAndStatus, function(key, val) {
                $scope.contentPage = $scope.contentPage.concat($scope.concatObjtoArr(val));
            });
            $scope.contentCurPage = $scope.contentPage.slice(0, $scope.pageLength);
        });
    }

    getCurCluster();
    
    $scope.upgradeAgent = function (clusterId) {
        glanceHttp.ajaxPut(['cluster.cluster'], {'id': clusterId, 'isUpdateAgent': true}, function() {
            $scope.cluster.agent_version = $rootScope.agentVersion;
            angular.forEach($scope.statusCache[$scope.cluster.id]["nodes"], function(node) {
                node.isUpgradeFailed = false;
            });
        });
    };
    
    $scope.isUpgradeFailed = function(statusNode) {
        return (statusNode.isUpgradeFailed && statusNode.agentVersion != $scope.cluster.agent_version
                && statusNode.agentVersion != $rootScope.agentVersion)
    }
    
    $scope.getUpgradeStatus = function(statusNodes){
        var noUpgradeNum = 0;
        angular.forEach(statusNodes, function(statusNode) {
            if ($scope.cluster.agent_version && statusNode.agentVersion != $scope.cluster.agent_version
                && statusNode.agentVersion != $rootScope.agentVersion && statusNode.status != NODE_STATUS.terminated) {
                noUpgradeNum += 1;
            }
        })
        var oldNum = $scope.countOldAgent(statusNodes);
        if (oldNum == 0) {
            return "success"
        } else if (noUpgradeNum > 0) {
            return "upgrading";
        } else {
            return "failed";
        }
    }
}

clusterDetailsCtrl.$inject = ["$rootScope", "$scope", "$stateParams", "glanceHttp", "Notification"];
glanceApp.controller("clusterDetailsCtrl", clusterDetailsCtrl);