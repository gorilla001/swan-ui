(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterBackendService', clusterBackendService);

    clusterBackendService.$inject = ['gHttp'];

    function clusterBackendService(gHttp) {
        return {
            listClusters: listClusters,
            listCluster: listCluster,
            listNodesByLabelIds: listNodesByLabelIds
        };

        ////////////

        function listClusters() {
            return gHttp.Resource('cluster.clusters').get();
        }

        function listCluster(clusterId) {
            return gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).get();
        }

        function listNodesByLabelIds(clusterId, labelIdsString) {
            var params = {
                cluster_id: clusterId,
                label_ids: labelIdsString
            };
            return gHttp.Resource('label.nodes', {cluster_id: clusterId}).get({params: params});
        }


    }
})();