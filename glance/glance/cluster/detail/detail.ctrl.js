/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterDetailCtrl', ClusterDetailCtrl);

    /* @ngInject */
    function ClusterDetailCtrl(clusterDetail, clusterCurd) {
        var self = this;

        self.CLUSTER_STATUS = CLUSTER_STATUS;

        self.cluster = clusterDetail;
        self.nodeTotal = sumNodeTotal(self.cluster.node_nums).reduce(function (previousValue, currentValue) {
            return previousValue + currentValue
        });

        self.deleteCluster = deleteCluster;

        function deleteCluster(clusterId, ev) {
            clusterCurd.deleteCluster(clusterId, ev)
        }

        function sumNodeTotal(object) {
            var values = [];
            for (var property in object) {
                values.push(object[property])
            }

            return values
        }
    }
})();