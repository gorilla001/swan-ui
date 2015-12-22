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
            listClusterLabels: listClusterLabels
        };

        function listClusterLabels(clusterId, $scope) {
            glanceHttp.ajaxGet(['cluster.clusterIns', ({cluster_id: clusterId})], function () {
                }, undefined, function () {
                })
                .success(function (data) {
                    $scope.creatAppLableList = getLables(data.data)
                })
                .error(function (data, status) {

                })
        }

        function getLables(data) {
            var lableSet = new Set();
            var lableList = [];
            angular.forEach(data.nodes, function (node, nodeIndex) {
                angular.forEach(node.node_labels, function (nodelabe, labeIndex) {
                    lableSet.add(nodelabe.label.name)
                })
            });

            lableSet.forEach(function (value1, value2, set) {
                var lableObj = {};
                lableObj.lableName = value1;
                lableList.push(lableObj);
            });

            return lableList;

        }
    }
})();