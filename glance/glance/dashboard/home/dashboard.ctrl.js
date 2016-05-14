/**
 * Created by myu on 15-9-22.
 */
(function () {
    'use strict';
    angular.module('glance.dashboard').controller('DashboardCtrl', DashboardCtrl);

    /* @ngInject */
    function DashboardCtrl($scope, ClusterStatusMgr, dashboardBackend, glanceHttp) {
        var self = this;

        self.statusMgr = new ClusterStatusMgr();
        // 是否展示app下拉
        self.dropStatus = false;
        self.dropShow = dropShow;

        activate();

        function activate() {
            listAllClusters();
        }

        function listAllClusters() {
            dashboardBackend.listAllClusters()
                .then(function (data) {
                    if (data) {
                        self.clusterList = collectClusterList(data);
                        joinMonitorInClusterList()
                    }
                });
        }

        function joinMonitorInClusterList() {
            angular.forEach(self.clusterList, function (cluster) {
                if (cluster.nodes.length) {
                    glanceHttp.ajaxGet(['metrics.getClusterMonitor', {cluster_id: cluster.id}], function (data) {
                        self.errorCode = data.code;
                        if (data && data.data) {
                            if (data.data.appMetrics) {
                                cluster.appMonitors = data.data.appMetrics;
                            }
                            if (data.data.masMetrics) {
                                cluster.masMetrics = data.data.masMetrics;
                            }
                            // 设置app下拉插件
                            angular.element(document).find('.mCustomScrollbar').mCustomScrollbar();
                        }
                    }, undefined, undefined, function (data) {
                        self.errorCode = data.code;
                    });
                }
            });
        }

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
                        masMetrics: {}
                    };
                }

                for (var j = 0; j < cluster.nodes.length; j++) {
                    self.statusMgr.addNode(cluster.id, cluster.nodes[j]);
                }
            }
            self.statusMgr.startListen($scope);
            return clusterList;
        }

        // 应用下拉展示
        function dropShow() {
            self.dropStatus = !self.dropStatus;
        }
    }
})();