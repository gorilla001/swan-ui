/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterNodesCtrl', ClusterNodesCtrl);

    /* @ngInject */
    function ClusterNodesCtrl(mdTable, nodes, $stateParams, clusterBackend) {
        var self = this;

        self.NODE_STATUS_NAME = NODE_STATUS_NAME;
        self.SERVICE_NAME = SERVICE_NAME;
        self.selected = [];
        self.table = mdTable.createTable('cluster.detail.nodes');
        self.searchKeyWord = $stateParams.keywords || '';
        self.nodes = nodes.nodes;
        self.count = nodes.total;
        self.updateInfo = {};

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
    }
})();