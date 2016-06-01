/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MonitorAppCtrl', MonitorAppCtrl);

    /* @ngInject */
    function MonitorAppCtrl($scope, $sce, appservice, monitor, appChart) {
        var self = this;
        self.withGrafana = GRAFANA_CONFIG.baseUrl;
        self.appMonitors = {};

        self.appInfo = $scope.detailAppCtrl.appInfo;
        self.metricUrls = {};
        self.appIframeUrls = [];
        self.metrics = {
            1: {"id": 1, "desc": "CPU Usage"},
            2: {"id": 2, "desc": "Mem Usage"},
            3: {"id": 3, "desc": "Network I/O"},
            4: {"id": 4, "desc": "Disk I/O"}
        };

        activate();

        function activate() {
            initMonitor();
            appChart.paintReqRateChart(self.appInfo.cid, self.appInfo.alias, 'req-rate-chart');
            appChart.paintMonitorCharts(self.appInfo.cid, self.appInfo.alias, {
                cpu: 'cpu-chart',
                mem: 'mem-chart',
                diskRead: 'disk-read-chart',
                diskWrite: 'disk-write-chart',
                networkSend: 'network-send-chart',
                networkRecevied: 'network-recevied-chart'
            });
        }


        $scope.$on('refreshAppData', function () {
            activate();
        });

        function initMonitor() {
            appservice.getAppMetics(self.appInfo.cid, self.appInfo.alias)
                .then(function (data) {
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
                    });
                }, function (res) {
                    self.errorCode = res.code;
                });
        }
    }
})();
