(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterBackend', clusterBackend);

    /* @ngInject*/
    function clusterBackend(gHttp) {
        return {
            listClusters: listClusters,
            getCluster: getCluster,
            listNodesByLabelIds: listNodesByLabelIds,
            listNodes: listNodes,
            deleteCluster: deleteCluster,
            getOldVersionNums: getOldVersionNums,
            upgradeNode: upgradeNode,
            deleteNodes: deleteNodes,
            deleteLabel: deleteLabel,
            listLabels: listLabels,
            createLabel: createLabel,
            tearLabel: tearLabel,
            attachLabel: attachLabel
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

        function listNodes(clusterId, params, loading) {
            return gHttp.Resource('cluster.nodes', {cluster_id: clusterId}).get({params: params, "loading": loading});
        }

        function deleteCluster(clusterId) {
            return gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).delete();
        }

        function getOldVersionNums(clusterId) {
            return gHttp.Resource('cluster.oldversion', {cluster_id: clusterId}).get();
        }

        function upgradeNode(clusterId) {
            return gHttp.Resource('cluster.cluster', {'cluster_id': clusterId}).patch({method: 'upgrade'});
        }

        function deleteNodes(clusterId, data) {
            return gHttp.Resource('cluster.nodes', {'cluster_id': clusterId}).delete({'data': data});
        }

        function deleteLabel(data) {
            return gHttp.Resource('cluster.labels').delete({"data": data})
        }

        function listLabels() {
            return gHttp.Resource('cluster.labels').get()
        }

        function createLabel(data) {
            return gHttp.Resource('cluster.labels').post({name: data})
        }

        function tearLabel(data, clusterId) {
            return gHttp.Resource('cluster.nodesLabels', {'cluster_id': clusterId}).delete({'data': data})
        }

        function attachLabel(data, clusterId) {
            return gHttp.Resource('cluster.nodesLabels', {'cluster_id': clusterId}).post(data)
        }
    }
})();