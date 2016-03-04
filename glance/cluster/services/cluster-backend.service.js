(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterBackendService', clusterBackendService);

    clusterBackendService.$inject = ['gHttp'];

    function clusterBackendService(gHttp) {
        return {
            listClusters: listClusters,
            getCluster: getCluster,
            listNodesByLabelIds: listNodesByLabelIds
        };

        ////////////

        function listClusters() {
            return gHttp.Resource('cluster.clusters').get();
        }

        function getCluster(clusterId) {
            return gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).get();
        }

        function listNodesByLabelIds(clusterId, labelIdsString) {
            var params = {
                cluster_id: clusterId,
                label_ids: labelIdsString
            };
            return gHttp.Resource('cluster.nodes', {cluster_id: clusterId}).get({params: params});
        }


    }
})();