/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterNodesCtrl', ClusterNodesCtrl);

    /* @ngInject */
    function ClusterNodesCtrl(mdTable, nodes, $stateParams) {
        var self = this;

        console.log(nodes);

        self.NODE_STATUS_NAME = NODE_STATUS_NAME;
        self.selected = [];
        self.table = mdTable.createTable('cluster.detail.nodes');
        self.searchKeyWord = $stateParams.keywords || '';
        self.nodes = nodes.nodes;
        self.count = nodes.total;

        ///
    }
})();