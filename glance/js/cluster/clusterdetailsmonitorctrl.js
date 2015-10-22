function clusterMonitorCtrl($rootScope, $stateParams, glanceHttp, buildCharts, monitor) {
    $rootScope.clusterClass = 'clusterMonitor';
    var DOMs = {
        'cpu': 'cluster-cpu-chart',
        'memory': 'cluster-memory-chart',
        'disk': 'cluster-disk-chart'
    };
    glanceHttp.ajaxGet(["metrics.getClusterMonitor", {cluster_id: $stateParams.clusterId}], function (data) {
        var chartsData = monitor.httpMonitor.getChartsData(data.data);
        buildCharts.lineCharts(chartsData, DOMs, 'cluster');
    });

}

clusterMonitorCtrl.$inject = ['$rootScope', '$stateParams', 'glanceHttp', 'buildCharts', 'monitor'];
glanceApp.controller("clusterMonitorCtrl", clusterMonitorCtrl);