/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterNodesCtrl', ClusterNodesCtrl);

    /* @ngInject */
    function ClusterNodesCtrl(mdTable, nodes, $stateParams, clusterBackend, $scope, addLabelDialog, tearLabelDialog, $state, clusterCurd) {
        var self = this;

        self.NODE_STATUS_NAME = NODE_STATUS_NAME;
        self.SERVICE_NAME = SERVICE_NAME;
        self.CLUSTER_STATUS = CLUSTER_STATUS;

        self.selected = [];
        self.table = mdTable.createTable('cluster.detail.nodes');
        self.searchKeyWord = $stateParams.keywords || '';
        self.nodes = nodes.nodes;
        self.count = nodes.total;
        self.updateInfo = {};

        self.upgradeNode = upgradeNode;
        self.deletNodes = deletNodes;
        self.showAddLabelDialog = showAddLabelDialog;
        self.showTearLabelDialog = showTearLabelDialog;

        activate();

        function activate() {
            checkUpdate();
            //监听主机状态 websocket
            $scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
                if (data.clusterId == $stateParams.clusterId) {
                    //when node status is change, you should be check the cluster.node_nums['0_terminated'],
                    //to control the cluster upgrade button disable/enable
                    clusterBackend.getCluster($stateParams.clusterId)
                    .then(function (data) {
                        $scope.clusterDetailCtrl.cluster = data;
                        
                    });
                    
                    angular.forEach(self.nodes, function (item, index) {
                        if (item.id == data.nodeId) {
                            item.status = data.status
                        }
                    });
                }
            });

            //监听升级失败 websocket
            $scope.$on(SUB_INFOTYPE.agentUpgradeFailed, function (event, data) {
                self.upgradeFailed[data.nodeId] = true;
            });

            $scope.$on('upgradeComplete', function (event, data) {
                checkUpdate()
                    .then(function (data) {
                        self.upgrageFail = !!data.node;
                    });
            });
        }

        function checkUpdate() {
            return clusterBackend.getOldVersionNums($stateParams.clusterId)
                .then(function (data) {
                    self.updateInfo = data;
                    return self.updateInfo;
                })
        }

        function upgradeNode(clusterId) {
            //reset some flags
            self.upgrageFail = false;
            self.upgradeFailed = {};

            clusterBackend.upgradeNode(clusterId)
        }

        function deletNodes(ev, selectNodes) {
            clusterCurd.deletNodes($stateParams.clusterId, selectNodes, ev)
        }

        function showAddLabelDialog(ev) {
            addLabelDialog.open(ev)
                .then(function (selectLabels) {
                    var obj = {};

                    if (selectLabels.length) {

                        obj.labels = selectLabels;
                        obj.nodes = formatSelectNodes(self.selected);

                        clusterBackend.attachLabel(obj, $stateParams.clusterId)
                            .then(function (data) {
                                $state.reload();
                            })
                    }
                })
        }

        function showTearLabelDialog(ev, selectNodes) {
            tearLabelDialog.open(ev, selectNodes)
                .then(function (unSelectLabels) {
                    var obj = {};

                    if (unSelectLabels.length) {
                        obj.labels = unSelectLabels;
                        obj.nodes = formatSelectNodes(self.selected);

                        clusterBackend.tearLabel(obj, $stateParams.clusterId)
                            .then(function (data) {
                                $state.reload();
                            })
                    }

                })
        }

        function formatSelectNodes(selectNodes) {
            var selectNodesTemp = [];

            angular.forEach(selectNodes, function (item, index) {
                selectNodesTemp.push(item.id)
            });

            return selectNodesTemp
        }


    }
})();