(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appChart', appChart);

    /* @ngInject */
    function appChart(appservice, lineChart) {
        return {
            paintReqRateChart: paintReqRateChart,
            paintMonitorCharts: paintMonitorCharts
        };
        
        function paintReqRateChart(clusterId, appAlias, domId) {
            appservice.getReqRate(clusterId, appAlias).then(function (data) {
                function timeGetter(data){
                    return Math.round(data.time / 1000000000 / 60);
                }
                function dataGetter(data) {
                    return {'请求数目': data.reqrate};
                }
                var chartData = lineChart.buildChartData(data, timeGetter, dataGetter);
                lineChart.paint(chartData, domId, {
                    title: '请求数监控',
                    subtitle: '一小时内变化',
                    unit: 'count/s'
                })
            });
            
        }
        
        function paintMonitorCharts(clusterId, appAlias, domIds) {
            appservice.getMonitor(clusterId, appAlias).then(function (data) {
                function timeGetter(data){
                    return Math.round(data.time / 1000000000 / 60);
                }
                var chartData = lineChart.buildChartData(data, timeGetter, monitorDataGetter);
                lineChart.paint(chartData, domIds.cpu, {
                    title: 'CPU监控',
                    subtitle: '一小时内变化',
                    unit: '%'
                }, seriesNameGetterBuilder('cpu'), 100);
                lineChart.paint(chartData, domIds.mem, {
                    title: '内存监控',
                    subtitle: '一小时内变化',
                    unit: '%'
                }, seriesNameGetterBuilder('mem'), 100);
                lineChart.paint(chartData, domIds.diskRead, {
                    title: '磁盘读速率监控',
                    subtitle: '一小时内变化',
                    unit: 'B/s'
                }, seriesNameGetterBuilder('diskRead'));
                lineChart.paint(chartData, domIds.diskWrite, {
                    title: '磁盘写速率监控',
                    subtitle: '一小时内变化',
                    unit: 'B/s'
                }, seriesNameGetterBuilder('diskWrite'));
                lineChart.paint(chartData, domIds.networkSend, {
                    title: '网络发送速率监控',
                    subtitle: '一小时内变化',
                    unit: 'B/s'
                }, seriesNameGetterBuilder('networkSend'));
                lineChart.paint(chartData, domIds.networkRecevied, {
                    title: '网络接收速率监控',
                    subtitle: '一小时内变化',
                    unit: 'B/s'
                }, seriesNameGetterBuilder('networkRecevied'));
            });
        }
        
        function monitorDataGetter(data) {
            var result = {};
            result[data.instance + "-cpu"] = data.cpuUsed*100;
            result[data.instance + "-mem"] = data.memoryUsed/data.memoryTotal*100;
            result[data.instance + "-diskRead"] = data.diskReadRate;
            result[data.instance + "-diskWrite"] = data.diskWriteRate;
            result[data.instance + "-networkSend"] = data.networkSend;
            result[data.instance + "-networkRecevied"] = data.networkRecevied;
            return result;
        }
        
        function seriesNameGetterBuilder(name) {
            function seriesNameGetter(key) {
                var temps = key.split('-');
                var instanceName = temps[0];
                if (temps[1] === name) {
                    return instanceName;
                }
            }
            return seriesNameGetter
        }
    }
})();