/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MonitorAppCtrl', MonitorAppCtrl);

    /* @ngInject */
    function MonitorAppCtrl($scope, $sce, appservice, monitor, buildCharts) {
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
            buildReqRateChart()
        }


        $scope.$on('refreshAppData', function () {
            initMonitor();
            buildReqRateChart()
        });

        function setIframeUrls() {
            if (!(self.appInfo.alias in self.metricUrls)) {
                angular.forEach(self.metrics, function (metric) {
                    self.iframeUrl = GRAFANA_CONFIG.baseUrl + "/dashboard-solo/db/app?panelId=" + metric.id + "&fullscreen&var-cluster_id_t=" + self.appInfo.cid + "&var-app_uuid_t=" + self.appInfo.alias + "&theme=light";
                    self.appIframeUrls.push($sce.trustAsResourceUrl(self.iframeUrl));
                });
                self.metricUrls[self.appInfo.alias] = self.appIframeUrls;
            } else {
                self.appIframeUrls = self.metricUrls[self.appInfo.alias];
            }
        }

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
                    if (typeof GRAFANA_CONFIG !== 'undefined') {
                        setIframeUrls();
                    }
                }, function (res) {
                    self.errorCode = res.code;
                });
        }

        function buildReqRateChart() {
            appservice.getReqRate(self.appInfo.cid, self.appInfo.alias).then(function (data) {
                if (!data) {
                    data = [{time: (new Date()).getTime() * 1000000}]
                }
                paintReqRateChart(data);
            });
        }

        function paintReqRateChart(data) {
            var dataInhour = monitor.httpMonitor.getDataInhour(data, 60, 60, function (data) {
                return data.time / 1000000000
            });
            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            var yAxis = [];
            for (var i = 0; i < 60; i++) {
                var val = yAxisDataInhour[i];
                if (!val) {
                    yAxis[i] = monitor.httpMonitor.setShowRatio([], 1);
                } else {
                    yAxis[i] = monitor.httpMonitor.setShowRatio([val.reqrate], 1);
                }
            }
            var indicator = {
                key: 'req',
                domId: "req-rate-chart",
                descriptions: {
                    title: '请求数监控',
                    subtitle: '一小时内变化 (count/s)',
                    seriesName: ['请求数目']
                },
                styles: {
                    lineWidth: 3,
                    axesColor: '#9B9B9B',
                    axiesFontsize: '11px'
                }
            };
            buildCharts.initIOCharts(indicator, xAxis, yAxis);
        }
    }
})();
