/**
 * Created by myu on 15-9-22.
 */
(function () {
    'use strict';
    glanceApp.controller('dynamicBaseCtrl', dynamicBaseCtrl);

    dynamicBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'groupNodes', '$q'];

    function dynamicBaseCtrl($scope, $rootScope, glanceHttp, groupNodes, $q) {
        $rootScope.show = 'dynamic';

        var clusterCache = {
            statusCache: {},
            servicesCache: {},
            amounts: {}
        };

        function listAllClusters() {
            var deferred = $q.defer();
            glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
                if (data && data.data) {
                    $scope.clusters = data.data;
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
                        if (data && data.data) {
                            if(data.data.appMetrics){
                                cluster.appMonitors = data.data.appMetrics;
                            }
                            if(data.data.masMetrics){
                                cluster.masMetrics = data.data.masMetrics;
                            }
                        }
                    });
                }
            });
        }

        var promise = listAllClusters();
        promise.then(jionMonitorInClusterList);


        function collectClusterList(clusters) {
            var clusterList = {};
            var cluster;
            var cache = {};
            for (var i = 0; i < clusters.length; i++) {
                cluster = clusters[i];

                cache = groupNodes.getNodesCache(cluster);
                clusterCache.statusCache[cluster.id] = cache.status;
                clusterCache.servicesCache[cluster.id] = cache.services;
                clusterCache.amounts[cluster.id] = cache.amounts;

                clusterList[cluster.id] = {
                    id: cluster.id,
                    name: cluster.name,
                    amounts: cache.amounts,
                    nodes: cluster.nodes,
                    appMonitors: [],
                    masMetrics:{}
                };

            }
            return clusterList;
        }

        $scope.$on('nodeStatusUpdate', function(event, data) {
            var clusterId = data.clusterId;
            var nodeId = data.nodeId;
            var status = data.status;

            var copyClusterCache = angular.copy(clusterCache);

            var cache = {
                nodeStatus: copyClusterCache.statusCache[clusterId][nodeId],
                services: copyClusterCache.servicesCache[clusterId][nodeId],
                amounts: copyClusterCache.amounts[data.clusterId]
            };

            var latestData = groupNodes.updateNodesAmounts($scope.clusters, clusterId, nodeId, undefined, status, cache);
            var amounts = latestData.amounts;

            $scope.clusterList[clusterId].amounts = amounts;

            //更新cache
            clusterCache.amounts[data.clusterId] = amounts;
            clusterCache.statusCache[clusterId][nodeId] = latestData.newNodeStatus;

        });

        $scope.$on('serviceStatusUpdate', function (event, data) {
            // console.log('services', data)
            // TODO

        });

    }
})();