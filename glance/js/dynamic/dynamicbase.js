/**
 * Created by myu on 15-9-22.
 */
(function () {
    'use strict';
    glanceApp.controller('dynamicBaseCtrl', dynamicBaseCtrl);

    dynamicBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', '$q', 'ClusterStatusMgr'];

    function dynamicBaseCtrl($scope, $rootScope, glanceHttp, $q, ClusterStatusMgr) {
        $rootScope.show = 'home';

        $scope.statusMgr = new ClusterStatusMgr($scope.latestVersion);

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
                        $scope.errorCode = data.code;
                        if (data && data.data) {
                            if(data.data.appMetrics){
                                cluster.appMonitors = data.data.appMetrics;
                            }
                            if(data.data.masMetrics){
                                cluster.masMetrics = data.data.masMetrics;
                            }
                        }
                    }, undefined, undefined, function(data) {
                        $scope.errorCode = data.code;
                        console.log(data.error);
                    });
                }
            });
        }

        var promise = listAllClusters();
        promise.then(joinMonitorInClusterList);

        function collectClusterList(clusters) {
            var clusterList = {};
            var cluster;
            for (var i = 0; i < clusters.length; i++) {
                cluster = clusters[i];
                
                if (cluster.nodes.length) {
                    
                    clusterList[cluster.id] = {
                        id: cluster.id,
                        name: cluster.name,
                        nodes: cluster.nodes,
                        appMonitors: [],
                        masMetrics:{}
                    };
                }
                
                for (var j = 0; j < cluster.nodes.length; j++) {
                    $scope.statusMgr.addNode(cluster.id, cluster.nodes[j]);
                }

            }
            $scope.statusMgr.startListen($scope);
            return clusterList;
        }
    }
})();