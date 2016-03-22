/**
 * Created by myu on 15-9-22.
 */
(function () {
    'use strict';
    glanceApp.controller('dynamicBaseCtrl', dynamicBaseCtrl);

    dynamicBaseCtrl.$inject = ['$scope', 'glanceHttp', '$q', 'ClusterStatusMgr', 'gHttp'];

    function dynamicBaseCtrl($scope, glanceHttp, $q, ClusterStatusMgr, gHttp) {
        $scope.statusMgr = new ClusterStatusMgr();

        var listClusterDataGetFromBackend;

        function listAllClusters() {
            var deferred = $q.defer();
            gHttp.Resource('cluster.clusters').get().then(function (data) {
                if (data) {
                    listClusterDataGetFromBackend = data.data;
                    $scope.clusterList = collectClusterList(data);
                    deferred.resolve();
                }
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