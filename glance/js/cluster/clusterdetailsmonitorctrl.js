function clusterMonitorCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, $interval, Notification) {
    $rootScope.clusterClass = 'clusterMonitor';
    $scope.showAppMetrics = false;
    var cpuUsed = 0, cpuTotal = 0, memUsed = 0, memTotal = 0;
    var successCycle,errorCycle;

    var clusterChart = echarts.init(document.getElementById('clusterMetrics'));

    $scope.getClusterMonitor = function () {
        glanceHttp.ajaxGet(["metrics.getClusterMonitor", {cluster_id: $stateParams.clusterId}], function (data) {
            cpuUsed = 0, cpuTotal = 0, memUsed = 0, memTotal = 0;
            if (data.data) {
                $scope.clusterMonitors = data.data;
                angular.forEach($scope.clusterMonitors.appMetrics, function (value, index, array) {
                    cpuUsed += value.appCpuUsed;
                    memUsed += value.appMemUsed;
                });
                cpuTotal = $scope.clusterMonitors.masMetrics.cpuTotal;
                memTotal = $scope.clusterMonitors.masMetrics.memTotal;

                option.series[0].data[0].value = $scope.clusterMonitors.masMetrics.cpuPercent;
                option.series[0].data[1].value = 100 - option.series[0].data[0].value;
                option.series[0].itemStyle.normal.label.formatter = dataFormatter;
                option.series[0].data[0].name = "集群CPU占用";

                option.series[1].data[0].value = ($scope.clusterMonitors.masMetrics.memUsed / $scope.clusterMonitors.masMetrics.memTotal) * 100;
                option.series[1].data[1].value = 100 - option.series[1].data[0].value;
                option.series[1].itemStyle.normal.label.formatter = dataFormatter;
                option.series[1].data[0].name = "集群内存占用";
                clusterChart.setOption(option);
                $scope.showAppMetrics = true;
            }
            successCycle = $timeout($scope.getClusterMonitor, 3000);

        },undefined, null, function (data) {
            if(data.code === 1){
                //when data is null
                option.series[0].data[0].value = 0;
                option.series[0].data[1].value = 100;
                option.series[0].data[0].name = "集群CPU占用:无";
                option.series[0].itemStyle.normal.label.formatter = "";

                option.series[1].data[0].value = 0;
                option.series[1].data[1].value = 100;
                option.series[1].data[0].name = "集群内存占用:无";
                option.series[1].itemStyle.normal.label.formatter = "";
                clusterChart.setOption(option);
                errorCycle = $timeout($scope.getClusterMonitor, 3000);
            }
        });
    };

    $scope.getClusterMonitor();

    var labelTop = {
        normal: {
            color: '#cccccc',
            label: {
                show: false,
                position: 'center',
                formatter: '{a}',
                textStyle: {
                    baseline: 'bottom'
                }
            },
            labelLine: {
                show: false
            }
        }
    };
    var labelFromatter = {
        normal: {
            label: {
                show: true,
                formatter: dataFormatter,
                textStyle: {
                    baseline: 'top',
                    fontSize: 17,
                    color: '#000000'
                }
            }
        }
    };
    var labelBottom = {
        normal: {
            color: '#4a86e8',
            label: {
                show: true,
                position: 'center'
            },
            labelLine: {
                show: false
            }
        }
    };
    var radius = [85, 90];
    var option = {
        toolbox: {
            show: true,
            textStyle: {
                color: '#cccccc',
                fontSize: 20
            }
        },
        series: [
            {
                type: 'pie',
                center: ['20%', '30%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [
                    {name: '集群CPU占用', itemStyle: labelBottom},
                    {name: 'CPU', itemStyle: labelTop}
                ]
            },
            {
                type: 'pie',
                center: ['80%', '30%'],
                radius: radius,
                itemStyle: labelFromatter,
                data: [
                    {name: '集群内存占用', itemStyle: labelBottom},
                    {name: '内存', itemStyle: labelTop}
                ]
            }
        ]
    };

    function dataFormatter(params){
            return params.name + ':' + params.value.toFixed(2) + '%'
    }


    $scope.$on('$destroy', function () {
        clusterChart.clear();
        clusterChart.dispose();
        $timeout.cancel(successCycle);
        $timeout.cancel(errorCycle);
    });
}

clusterMonitorCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', '$interval','Notification'];
glanceApp.controller("clusterMonitorCtrl", clusterMonitorCtrl);