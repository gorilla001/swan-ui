/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .controller('ClusterDetailCtrl', ClusterDetailCtrl);

    /* @ngInject */
    function ClusterDetailCtrl(clusterDetail, clusterCurd, $scope) {
        var self = this;

        self.CLUSTER_STATUS = CLUSTER_STATUS;

        self.cluster = clusterDetail;
        self.nodeTotal = sumNodeTotal(self.cluster.node_nums);

        self.deleteCluster = deleteCluster;

        function deleteCluster(clusterId, ev) {
            clusterCurd.deleteCluster(clusterId, ev, self.nodeTotal)
        }

        function sumNodeTotal(nodeNums) {
            var total = 0;
            angular.forEach(nodeNums, function (value) {
                total += value;
            });
            return total;
        }

        //监听集群状态 websocket
        $scope.$on(SUB_INFOTYPE.clusterStatus, function (event, data) {
            if (data.clusterId === self.cluster.id) {
                if (self.cluster.status === 'upgrading' && data.status !== 'upgrading') {
                    $scope.$broadcast('upgradeComplete');
                }
                
                self.cluster.status = data.status;
            }
        })
    }
})();