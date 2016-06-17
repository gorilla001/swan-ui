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
            checkUpdate()
        }

        function checkUpdate() {
            clusterBackend.getOldVersionNums($stateParams.clusterId)
                .then(function (data) {
                    self.updateInfo = data;
                })
        }

        function upgradeNode(clusterId) {
            clusterBackend.upgradeNode(clusterId)
                .then(function (data) {

                })
        }

        function deletNodes(ev, selectNodes){
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

        //监听主机状态 websocket
        $scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
            angular.forEach(self.nodes, function (item, index) {
                if (item.id == data.nodeId) {
                    item.status = data.status
                }
            });
        })
    }
})();