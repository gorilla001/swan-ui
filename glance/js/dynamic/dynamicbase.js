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

        var listClusterDataGetFromBackend;

        function listAllClusters() {
            var deferred = $q.defer();
            glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
                if (data && data.data) {
                    listClusterDataGetFromBackend = data.data;
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
            updateNodes(data.clusterId, data.nodeId, data.status);
        });

        $scope.$on('serviceStatusUpdate', function (event, data) {
            var cacheServices = clusterCache.servicesCache[data.clusterId];
            var latestServices = collectLatestServices(data, cacheServices);

            updateNodes(data.clusterId, data.nodeId, undefined, latestServices);
        });

        function updateNodes(clusterId, nodeId, status, services) {

            var copyClusterCache = angular.copy(clusterCache);

            var cache = {
                nodeStatus: copyClusterCache.statusCache[clusterId][nodeId],
                services: copyClusterCache.servicesCache[clusterId][nodeId],
                amounts: copyClusterCache.amounts[clusterId]
            };

            var latestData = groupNodes.updateNodesAmounts(listClusterDataGetFromBackend, clusterId, nodeId, services, status, cache);

            $scope.clusterList[clusterId].amounts = latestData.amounts;

            //更新cache
            clusterCache.amounts[clusterId] = latestData.amounts;
            clusterCache.statusCache[clusterId][nodeId] = latestData.newNodeStatus;
            if(services) {
                clusterCache.servicesCache[clusterId][nodeId] = latestData.newServices;
            }
        }

        function collectLatestServices(wsData, cacheServices) {
            var latestServices = angular.copy(cacheServices);
            var key;
            for (key in wsData) {
                if ((key !== 'clusterId') && (key !== 'nodeId')) {
                    latestServices[key] = wsData[key];
                }
            }
            return latestServices;
        }

    }
})();