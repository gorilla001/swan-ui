function clusterDetailsCtrl($rootScope, $scope, $stateParams, glanceHttp, Notification, ClusterStatusMgr, clusterStatus) {
    'use strict';

    $scope.failedNodeIds = [];
    $scope.failedNodes = [];

    var clusterStatusTexts = {
        running: '运行正常',
        installing: '初始化中',
        abnormal: '异常',
        unknow: '未知'
    };

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

            $scope.clusterStatus = clusterStatus.getClusterStatus($scope.cluster.nodes, $scope.cluster.cluster_type);
            $scope.clusterStatusText = clusterStatusTexts[$scope.clusterStatus];
            $scope.nodeStatusCount = $scope.statusMgr.nodeStatusCount[$stateParams.clusterId];

        });
    }
    getCurCluster();
    
    $scope.upgradeNode = function (clusterId) {
        glanceHttp.ajaxPut(['cluster.cluster'], {'id': clusterId, 'isUpgrade': true}, function() {
            $scope.upgradeFailedNodes = {};
        });
    };

    $scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
        clusterStatus.updateClusterStatus(data, [$scope.cluster]);
        updateClusterStatus();
    });

    $scope.$on(SUB_INFOTYPE.serviceStatus, function (event, data) {
        clusterStatus.updateClusterStatus(data, [$scope.cluster]);
        updateClusterStatus();
    });

    function updateClusterStatus() {
        $scope.clusterStatus = $scope.cluster.clusterStatus;
        $scope.clusterStatusText = clusterStatusTexts[$scope.clusterStatus];
    }


    // $scope.repairCluster = function() {
    //     glanceHttp.ajaxPost(['cluster.repair', {
    //         'cluster_id': $stateParams.clusterId
    //     }], {'ids': $scope.failedNodeIds}, function(resp) {
    //         $scope.callback(resp.data);
    //     }, null, function(resp) {
    //         // todo
    //         // Notification.error(resp.errors);
    //     });
    // };

    // function listenNodeStatusConut() {
    //     $scope.$on($scope.nodeStatusCount.failed, function(event, data) {
    //         listFailedNodesAndIds();
    //     });
    // }

    

    // function listFailedNodesAndIds() {
    //     listFailedNodeIds();
    //     listFailedNodes();
    // }

    // function listFailedNodeIds() {
    //     var nodes = $scope.statusMgr.nodes;
    //     for(var nodeId in nodes) {
    //         if (nodes[nodeId].status === NODE_STATUS.failed) {
    //             $scope.failedNodeIds.push(nodeId);
    //         }
    //     }
    // }

    // function listFailedNodes() {
    //     var allNodes = $scope.cluster.nodes;
    //     for (var i = 0; i < allNodes.length; i++) {
    //         if ($scope.failedNodeIds.indexOf(allNodes[i].id) !== -1) {
    //             $scope.failedNodes.push(allNodes[i]);
    //         }
    //     }
    // }

}

clusterDetailsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'glanceHttp', 'Notification', 'ClusterStatusMgr', 'clusterStatus'];
glanceApp.controller('clusterDetailsCtrl', clusterDetailsCtrl);