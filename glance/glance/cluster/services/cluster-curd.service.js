/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterCurd', clusterCurd);


    /* @ngInject */
    function clusterCurd(clusterBackendService) {
        return {
            listClusterLables: listClusterLables

        };

        function listClusterLables() {
            return clusterBackendService.listClusters()
                .then(function (data) {
                    var clusters = [];

                    angular.forEach(data, function (cluster, index) {
                        if (cluster.group_name) {
                            clusters.push({id: cluster.id, name: cluster.group_name + ":" + cluster.name});
                        } else {
                            clusters.push({id: cluster.id, name: cluster.name});
                        }
                    });

                    return clusters
                });
        }

    }
})();