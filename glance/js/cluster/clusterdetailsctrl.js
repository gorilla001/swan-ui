function clusterDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, Notification, ClusterStatusMgr, clusterStatus, labelService) {
    'use strict';

    var clusterStatusTexts = {
        running: '运行正常',
        installing: '初始化中',
        abnormal: '异常',
        unknow: '未知'
    };

    $scope.showCreateNode = false;

    $scope.clusterLabels = {};

    $scope.statusMgr = new ClusterStatusMgr($scope.latestVersion);
    function getCurCluster() {
        glanceHttp.ajaxGet(["cluster.clusterIns", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.cluster = data.data;
            $scope.clusterLabels = collectClusterLabels(data.data.nodes);

            $scope.totalItems = $scope.cluster.nodes.length;
            if (!$scope.totalItems) {
                $scope.showCreateNode = true;
            }
            $scope.pageLength = 20;
            $scope.showPagination = $scope.totalItems > $scope.pageLength;

            $scope.currentPage = 1;
            var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus($scope.cluster.nodes, $scope.cluster.id, $scope.statusMgr);

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
    }
    getCurCluster();
    
    $scope.isShowUpgradeFailedMsg = true;
    
    $scope.upgradeNode = function (clusterId) {
        glanceHttp.ajaxPut(['cluster.cluster'], {'id': clusterId, 'isUpgrade': true}, function() {
            $scope.upgradeFailedNodes = null;
            $scope.isShowUpgradeFailedMsg = true;
        });
    };
    
    $scope.closeUpgradeFailedMsg = function () {
        $scope.isShowUpgradeFailedMsg = false;
    };

    $scope.listCheckedNodeLables = function (checkedNodeIds) {
        var checkedNodeLables = [];
        var labelIds = [];
        angular.forEach(checkedNodeIds, function(nodeId, index) {
            checkedNodeLables = checkedNodeLables.concat($scope.clusterLabels[nodeId]);
        });
        checkedNodeLables = removeReduplicateLabels(checkedNodeLables);
        return checkedNodeLables;
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

    function collectClusterLabels(nodes) {
        var clusterLabels = {};

        angular.forEach(nodes, function(node, index) {
            clusterLabels[node.id] = labelService.formatNodeLabels(node.node_labels);
        });
        return clusterLabels;
    }

    function removeReduplicateLabels(allLabels) {
        var labels = [];
        var labelIds = [];
        angular.forEach(allLabels, function(label, index) {
            if(labelIds.indexOf(label.id) === -1) {
                labelIds.push(label.id);
                labels.push(label);
            }
        });
        return labels;
    }
}

clusterDetailsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'glanceHttp', 'Notification', 'ClusterStatusMgr', 'clusterStatus', 'labelService'];
glanceApp.controller('clusterDetailsCtrl', clusterDetailsCtrl);