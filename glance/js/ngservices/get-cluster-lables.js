/**
 * Created by my9074 on 15/12/22.
 */
(function () {
    'use strict';
    angular.module('glance')
        .factory('getClusterLables', getClusterLables);

    getClusterLables.$inject = ['glanceHttp', 'Notification'];

    function getClusterLables(glanceHttp, Notification) {
        return {
            listClusterLabels: listClusterLabels,
            getNodesIdList: getNodesIdList
        };

        function listClusterLabels(clusterId, scope) {
            glanceHttp.ajaxGet(['cluster.clusterIns', ({cluster_id: clusterId})], function () {
                }, undefined, function () {
                })
                .success(function (data) {
                    scope.creatAppLableList = getLables(data.data)
                })
                .error(function (data, status) {

                })
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
            return glanceHttp.ajaxGet(['cluster.clusterLabels', ({cluster_id: clusterId})], function(data){},
                    params, function(data){});
        }


    }
})();