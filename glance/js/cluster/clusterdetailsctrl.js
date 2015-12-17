function clusterDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, Notification, ClusterStatusMgr) {

    $scope.statusMgr = new ClusterStatusMgr($scope.latestVersion);
    $scope.upgradeFailedNodes = {};
    function getCurCluster() {
        glanceHttp.ajaxGet(["cluster.clusterIns", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.cluster = data.data;
            $scope.totalItems = $scope.cluster.nodes.length;
            $scope.pageLength = 20;
            $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;

            $scope.currentPage = 1;
            var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus($scope.cluster.nodes, $scope.cluster.id, $scope.statusMgr);

            $scope.statusMgr.startListen($scope);
            $scope.$on(SUB_INFOTYPE.agentUpgradeFailed, function (event, data) {
                $scope.upgradeFailedNodes[data.nodeId] = true;
            });
            $scope.contentPage = [];
            $.each(nodesWithRoleAndStatus, function(key, val) {
                $scope.contentPage = $scope.contentPage.concat($scope.concatObjtoArr(val));
            });
            $scope.contentCurPage = $scope.contentPage.slice(0, $scope.pageLength);
        });
    }
    getCurCluster();
    
    $scope.upgradeNode = function (clusterId) {
        glanceHttp.ajaxPut(['cluster.cluster'], {'id': clusterId, 'isUpgrade': true}, function() {
            $scope.upgradeFailedNodes = {};
        });
    };
    
}

clusterDetailsCtrl.$inject = ["$rootScope", "$scope", "$stateParams", "glanceHttp", "Notification", "ClusterStatusMgr"];
glanceApp.controller("clusterDetailsCtrl", clusterDetailsCtrl);