/**
 * Created by myu on 15-9-22.
 */
(function() {
    'use strict';
    glanceApp.controller('dynamicBaseCtrl', dynamicBaseCtrl);

    dynamicBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'groupNodes'];

    function dynamicBaseCtrl($scope, $rootScope, glanceHttp, groupNodes) {
        $rootScope.show = 'dynamic';

        $scope.clusterList = [];

        (function listAllClusters() {
            glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
                if (data && data.data) {
                    $scope.clusterList = collectClusterList(data.data);
                }
            });
        })();

        function collectClusterList(clusters) {
            var clusterList = [];
            var cluster;
            var amounts = {};
            for (var i = 0; i < clusters.length; i++) {
                cluster = clusters[i];
                amounts = groupNodes.countNodesAmounts(cluster.nodes);
                clusterList[i] = {
                    id: cluster.id,
                    name: cluster.name,
                    amounts: amounts
                };
            }
            return clusterList;
        }
    }
})();