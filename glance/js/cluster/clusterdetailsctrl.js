function clusterDetailsCtrl($scope, $stateParams, gHttp, Notification, ClusterStatusMgr, clusterStatus, labelService) {
    'use strict';

    var clusterStatusTexts = {
        running: '运行正常',
        installing: '初始化中',
        abnormal: '异常',
        unknow: '未知'
    };

    $scope.showCreateNode = false;

    $scope.clusterLabels = {};
    
    
    $scope.getCurCluster = function () {
        gHttp.Resource('cluster.cluster', {cluster_id: $stateParams.clusterId}).get().then(function (data) {
            $scope.cluster = data;
            $scope.clusterLabels = $scope.collectClusterLabels(data.nodes);

            $scope.totalItems = $scope.cluster.nodes.length;
            if (!$scope.totalItems) {
                $scope.showCreateNode = true;
            }
            $scope.pageLength = 20;
            $scope.showPagination = $scope.totalItems > $scope.pageLength;


            $scope.currentPage = 1;
            var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus($scope.cluster.nodes, $scope.cluster.id, $scope.statusMgr, $scope.cluster);

            $scope.statusMgr.startListen($scope);
            $scope.$on(SUB_INFOTYPE.agentUpgradeFailed, function (event, data) {
                if (!$scope.upgradeFailedNodes) {
                    $scope.upgradeFailedNodes = {};
                }
                $scope.upgradeFailedNodes[data.nodeId] = true;
            });
            $scope.contentPage = [];
            $.each(nodesWithRoleAndStatus, function(key, val) {
                $scope.contentPage = $scope.contentPage.concat($scope.concatObjtoArr(val));
            });
            $scope.contentCurPage = $scope.contentPage.slice(0, $scope.pageLength);

            $scope.clusterStatus = clusterStatus.getClusterStatus($scope.cluster.nodes, $scope.cluster.cluster_type);
            $scope.clusterStatusText = clusterStatusTexts[$scope.clusterStatus];
            $scope.clusterStatusTextClass =  clusterStatusTextClass();

            $scope.nodeStatusCount = $scope.statusMgr.nodeStatusCount[$stateParams.clusterId];

            listen2UpdateClusterStatus();
        });
    };

    gHttp.Resource('cluster.versions').get().then(function (data) {
        var latestVersion = data;
        $scope.statusMgr = new ClusterStatusMgr(latestVersion);
        $scope.getCurCluster();
    });
    
    $scope.isShowUpgradeFailedMsg = true;
    
    $scope.upgradeNode = function (clusterId) {
        gHttp.Resource('cluster.cluster', {'cluster_id': clusterId}).patch({'method': 'upgrade'}).then(function () {
            $scope.upgradeFailedNodes = null;
            $scope.isShowUpgradeFailedMsg = true;
        })
    };
    
    $scope.closeUpgradeFailedMsg = function () {
        $scope.isShowUpgradeFailedMsg = false;
    };

    function listen2UpdateClusterStatus() {
        $scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
            clusterStatus.updateClusterStatus(data, [$scope.cluster]);
            updateClusterStatus();
        });

        $scope.$on(SUB_INFOTYPE.serviceStatus, function (event, data) {
            clusterStatus.updateClusterStatus(data, [$scope.cluster]);
            updateClusterStatus();
        });
    }

    function updateClusterStatus() {
        $scope.clusterStatus = $scope.cluster.clusterStatus;
        $scope.clusterStatusText = clusterStatusTexts[$scope.clusterStatus];
        $scope.clusterStatusTextClass =  clusterStatusTextClass();
    }

    function clusterStatusTextClass() {
        var classes = {
            running: 'text-success',
            installing: 'text-info',
            abnormal: 'text-danger',
            unknow: 'text-warning'
        };
        return classes[$scope.clusterStatus];
    }

    $scope.collectClusterLabels = function (nodes) {
        var clusterLabels = {};

        angular.forEach(nodes, function(node, index) {
            clusterLabels[node.id] = labelService.formatNodeLabels(node.node_labels);
        });
        return clusterLabels;
    }
}

clusterDetailsCtrl.$inject = ['$scope', '$stateParams', 'gHttp', 'Notification', 'ClusterStatusMgr', 'clusterStatus', 'labelService'];
glanceApp.controller('clusterDetailsCtrl', clusterDetailsCtrl);