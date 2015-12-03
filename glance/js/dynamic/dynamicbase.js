/**
 * Created by myu on 15-9-22.
 */
(function () {
    'use strict';
    glanceApp.controller('dynamicBaseCtrl', dynamicBaseCtrl);

    dynamicBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'groupNodes', '$q'];

    function dynamicBaseCtrl($scope, $rootScope, glanceHttp, groupNodes, $q) {
        $rootScope.show = 'dynamic';

        $scope.clusterList = [];

        function listAllClusters() {
            var deferred = $q.defer();
            glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
                if (data && data.data) {
                    $scope.clusterList = collectClusterList(data.data);
                }
                deferred.resolve();
            });

            return deferred.promise;
        }

        function jionMonitorInClusterList() {
            angular.forEach($scope.clusterList, function (cluster) {
                if(cluster.nodes.length){
                    glanceHttp.ajaxGet(["metrics.getClusterMonitor", {cluster_id: cluster.id}], function (data) {
                        if (data && data.data && data.data.appMetrics && data.data.masMetrics) {
                            cluster.appMonitors = data.data.appMetrics;
                            cluster.masMetrics = data.data.masMetrics;
                        }
                    });
                }
            });
        }

        var promise = listAllClusters();
        promise.then(jionMonitorInClusterList);


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
                    amounts: amounts,
                    nodes: cluster.nodes,
                    appMonitors: [],
                    masMetrics:{}
                };
            }
            return clusterList;
        }

    }
})();