function clusterMonitorCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, $interval) {
    $rootScope.clusterClass = 'clusterMonitor';
    $scope.showAppMetrics = false;
    var cpuUsed = 0, cpuTotal = 0, memUsed = 0, memTotal = 0;

    var clusterChart = echarts.init(document.getElementById('clusterMetrics'));
    clusterChart.showLoading({
        text: '正在计算集群总体数据...',
        effect: 'whirling', //spin' | 'bar' | 'ring' | 'whirling' | 'dynamicLine' | 'bubble'
        textStyle: {
            fontSize: 20
        }
    });

    var timeoutRes = $timeout(function () {
        clusterChart.hideLoading();
        $scope.showAppMetrics = true;
    }, 3000);

    $scope.getClusterMonitor = function () {
        glanceHttp.ajaxGet(["metrics.getClusterMonitor", {cluster_id: $stateParams.clusterId}], function (data) {
            cpuUsed = 0, cpuTotal = 0, memUsed = 0, memTotal = 0;
            if (data.data) {
                console.log(data.data);
                $scope.clusterMonitors = data.data;
                angular.forEach($scope.clusterMonitors.appMetrics, function (value, index, array) {
                    cpuUsed += value.appCpuUsed;
                    memUsed += value.appMemUsed;
                });
                cpuTotal = $scope.clusterMonitors.masMetrics.cpuTotal;
                memTotal = $scope.clusterMonitors.masMetrics.memTotal;

                option.series[0].data[0].value = (cpuUsed / cpuTotal) * 100;
                option.series[0].data[1].value = (1 - cpuUsed / cpuTotal) * 100;
                option.series[1].data[0].value = (memUsed / memTotal) * 100;
                option.series[1].data[1].value = (1 - memUsed / memTotal) * 100;
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
                formatter: function (params) {
                    return params.name + ':' + params.value.toFixed(1) + '%'
                },
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
                    {name: '集群CPU使用', itemStyle: labelBottom},
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

    var promise = $interval(function () {
        $scope.getClusterMonitor();
        clusterChart.setOption(option);
    }, 3000);

    $scope.$on('$destroy', function () {
        clusterChart.clear();
        clusterChart.dispose();
        $interval.cancel(promise);
        $timeout.cancel(timeoutRes);
    });
}

clusterMonitorCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', '$interval'];
glanceApp.controller("clusterMonitorCtrl", clusterMonitorCtrl);