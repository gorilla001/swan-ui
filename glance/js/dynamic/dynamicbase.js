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
            nodeStatusCache: {},
            rawStatusCache: {},
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

        function joinMonitorInClusterList() {
            angular.forEach($scope.clusterList, function (cluster) {
                if(cluster.nodes.length){
                    glanceHttp.ajaxGet(['metrics.getClusterMonitor', {cluster_id: cluster.id}], function (data) {
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
        promise.then(joinMonitorInClusterList);

        function collectClusterList(clusters) {
            var clusterList = {};
            var cluster;
            var originalCluster = {};
            for (var i = 0; i < clusters.length; i++) {
                cluster = clusters[i];

                if (cluster.nodes.length) {

                    originalCluster = groupNodes.getOriginalCluster(cluster);

                    clusterCache.nodeStatusCache[cluster.id] = originalCluster.nodeStatus;
                    clusterCache.rawStatusCache[cluster.id] = originalCluster.rawStatus;
                    clusterCache.servicesCache[cluster.id] = originalCluster.services;
                    clusterCache.amounts[cluster.id] = originalCluster.amounts;

                    clusterList[cluster.id] = {
                        id: cluster.id,
                        name: cluster.name,
                        amounts: originalCluster.amounts,
                        nodes: cluster.nodes,
                        appMonitors: [],
                        masMetrics:{}
                    };
                }

            }
            return clusterList;
        }

        $scope.$on('nodeStatusUpdate', function(event, data) {
            updateNodeAmountsAndClusterCache(data);
        });

        $scope.$on('serviceStatusUpdate', function (event, data) {
            updateNodeAmountsAndClusterCache(data);
        });

        function updateNodeAmountsAndClusterCache(wsData) {
            var latestData = groupNodes.updateClusterCache(listClusterDataGetFromBackend, wsData, clusterCache);

            // 更新页面数据
            $scope.clusterList[wsData.clusterId].amounts = latestData.newAmounts;

            // 更新集群cache
            clusterCache.nodeStatusCache[wsData.clusterId][wsData.nodeId] = latestData.newNodeStatus;
            clusterCache.rawStatusCache[wsData.clusterId][wsData.nodeId] = latestData.newRawStatus;
            clusterCache.servicesCache[wsData.clusterId][wsData.nodeId] = latestData.newServices;
            clusterCache.amounts[wsData.clusterId] = latestData.newAmounts;
        }

    }
})();