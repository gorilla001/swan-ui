/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MonitorAppCtrl', MonitorAppCtrl);

    /* @ngInject */
    function MonitorAppCtrl(gHttp, $scope, $sce, appservice, monitor, buildCharts) {
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
            buildReqRateChart();
        }
        
        function buildReqRateChart() {
            appservice.getReqRate($scope.appInfo.cid, $scope.appInfo.alias).then(function (data) {
                    paintReqRateChart(data);
                });
        }
        
        function paintReqRateChart(data) {
            var dataInhour = monitor.httpMonitor.getDataInhour(data, 60, 60, function (data) {return data.time/1000000000});
            var xAxis = dataInhour.xAxis;
            var yAxisDataInhour = dataInhour.yAxis;
            console.log(dataInhour)
            var yAxis = []
            for(var i = 0; i < 60; i++) {
                var val = yAxisDataInhour[i];
                if (!val) {
                    yAxis[i] = monitor.httpMonitor.setShowRatio([], 1);
                } else {
                    yAxis[i] = monitor.httpMonitor.setShowRatio([val.reqrate], 1);
                }
            }
            console.log(yAxis)
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
