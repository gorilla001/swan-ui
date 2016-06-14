(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterBackend', clusterBackend);

    clusterBackend.$inject = ['gHttp'];

    function clusterBackend(gHttp) {
        return {
            listClusters: listClusters,
            getCluster: getCluster,
            listNodesByLabelIds: listNodesByLabelIds,
            listNodes: listNodes,
            deleteCluster: deleteCluster
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

        function listNodes(params, clusterId, loading) {
            return gHttp.Resource('cluster.nodesV4', {cluster_id: clusterId}).get({params: params, "loading": loading});
        }

        function deleteCluster(clusterId){
            return gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).delete();
        }


    }
})();