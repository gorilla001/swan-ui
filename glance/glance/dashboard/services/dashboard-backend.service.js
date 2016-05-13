(function () {
    'use strict';
    angular.module('glance.dashboard')
        .factory('dashboardBackend', dashboardBackend);


    /* @ngInject */
    function dashboardBackend(gHttp) {
        return {
            listAllClusters: listAllClusters,
            getMetrics: getMetrics
        };

        function listAllClusters() {
            return gHttp.Resource('cluster.clusters').get();
        }

        function getMetrics(clusterId) {
            return gHttp.Resource('metrics.getClusterMonitor', {cluster_id: clusterId}).get();
        }
    }
})();