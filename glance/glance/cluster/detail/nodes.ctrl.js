/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterNodesCtrl', ClusterNodesCtrl);

    /* @ngInject */
    function ClusterNodesCtrl(mdTable, nodes, $stateParams, clusterBackend, $scope, addLabelDialog, $state) {
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
        self.showAddLabelDialog = showAddLabelDialog;

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

        function showAddLabelDialog(ev) {
            addLabelDialog.open(ev)
                .then(function (selectLabels) {
                    var obj = {};
                    var selectNodes= [];

                    if (selectLabels.length) {
                        angular.forEach(self.selected, function (item, index) {
                            selectNodes.push(item.id)
                        });

                        obj.labels = selectLabels;
                        obj.nodes = selectNodes;

                        clusterBackend.attachLabel(obj, $stateParams.clusterId)
                            .then(function(data){
                                $state.reload();
                            })
                    }
                })
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