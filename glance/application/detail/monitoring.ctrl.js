/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MonitorAppCtrl', MonitorAppCtrl);

    MonitorAppCtrl.$inject = ['gHttp', '$scope', '$sce'];

    function MonitorAppCtrl(gHttp, $scope, $sce) {
        var self = this;
        self.withGrafana = GRAFANA_CONFIG.baseUrl;
        self.appMonitors = {};

        initMonitor();

        $scope.$on('refreshAppData', function () {
            initMonitor();
        });

        $scope.metrics = {
            1: {"id": 1, "desc": "CPU Usage"},
            2: {"id": 2, "desc": "Mem Usage"},
            3: {"id": 3, "desc": "Network I/O"},
            4: {"id": 4, "desc": "Disk I/O"},
        };

        $scope.metricUrls = {};
        $scope.appIframeUrls = [];
        function setIframeUrls() {
            if (!($scope.appInfo.alias in $scope.metricUrls)) {
                angular.forEach($scope.metrics, function (metric) {
                    $scope.iframeUrl = GRAFANA_CONFIG.baseUrl + "/dashboard-solo/db/app?panelId=" + metric.id + "&fullscreen&var-cluster_id_t=" + $scope.appInfo.cid + "&var-app_uuid_t=" + $scope.appInfo.alias + "&theme=light"
                    $scope.appIframeUrls.push($sce.trustAsResourceUrl($scope.iframeUrl));
                })
                $scope.metricUrls[$scope.appInfo.alias] = $scope.appIframeUrls;
            } else {
            $scope.appIframeUrls = $scope.metricUrls[$scope.appInfo.alias];
            }
        };

        function initMonitor() {
            gHttp.Resource('metrics.appmonit', {
                clusterID: $scope.appInfo.cid,
                aliase: $scope.appInfo.alias
            }).get({loading: ''}).then(function (data) {
                self.errorCode = 0;
                self.cpuUsedCores = 0;
                self.cpuShareCores = 0;
                self.memoryUsed = 0;
                self.memoryTotal = 0;
                self.appMonitors = data;
                angular.forEach(self.appMonitors, function (appMonitor) {
                    self.cpuUsedCores += appMonitor.cpuUsedCores;
                    self.cpuShareCores += appMonitor.cpuShareCores;
                    self.memoryUsed += appMonitor.memoryUsed;
                    self.memoryTotal += appMonitor.memoryTotal;
                })
                if (typeof GRAFANA_CONFIG !== 'undefined') {
                    setIframeUrls();
                }
            }, function (res) {
                self.errorCode = res.code;
            });
        }
    }
})();
