/**
 * Created by my9074 on 15/12/22.
 */
(function () {
    'use strict';
    angular.module('glance')
        .factory('getClusterLables', getClusterLables);

    getClusterLables.$inject = ['gHttp', 'Notification'];

    function getClusterLables(gHttp, Notification) {
        return {
            listClusterLabels: listClusterLabels,
            getNodesIdList: getNodesIdList
        };

        function listClusterLabels(clusterId, scope) {
            gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).get().then(function (data) {
                scope.creatAppLableList = getLables(data);
            });
        }

        function getLables(data) {
            var lableIdTemp = [];
            var lableArray = [];
            angular.forEach(data.nodes, function (node, nodeIndex) {
                angular.forEach(node.node_labels, function (nodelabe, labeIndex) {
                    if (lableIdTemp.indexOf(nodelabe.label.id) === -1) {
                        lableArray.push(nodelabe.label);
                        lableIdTemp.push(nodelabe.label.id)
                    }
                })
            });

            return lableArray;

        }

        function getNodesIdList(clusterId, params){
            return gHttp.Resource('cluster.nodes', {cluster_id: clusterId}).get({'params': {'label_ids': params.join(',')}});
        }


    }
})();