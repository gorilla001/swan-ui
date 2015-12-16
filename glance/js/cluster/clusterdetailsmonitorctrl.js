function clusterMonitorCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification) {
    $rootScope.clusterClass = 'clusterMonitor';
    $scope.showAppMetrics = false;
    var successCycle, errorCycle;

    $scope.getClusterMonitor = function () {
        glanceHttp.ajaxGet(["metrics.getClusterMonitor", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.errorCode = data.code;
            if (data.data) {
                $scope.clusterMonitors = data.data;
                $scope.cpuUsed = 0, $scope.cpuTotal = 0, $scope.memUsed = 0, $scope.memTotal = 0;
                if ($scope.clusterMonitors.appMetrics) {
                    angular.forEach($scope.clusterMonitors.appMetrics, function (value, index, array) {
                        $scope.cpuUsed += value.appCpuUsed;
                        $scope.memUsed += value.appMemUsed;
                    });
                }
                $scope.cpuTotal = $scope.clusterMonitors.masMetrics.cpuTotal;
                $scope.memTotal = $scope.clusterMonitors.masMetrics.memTotal;
                $scope.showAppMetrics = true;
            }
            successCycle = $timeout($scope.getClusterMonitor, 3000);

        }, undefined, null, function (data) {
            $scope.errorCode = data.code;
            if (data.code === 1) {
                errorCycle = $timeout($scope.getClusterMonitor, 3000);
            }
        });
    };

    $scope.getClusterMonitor();

    $scope.$on('$destroy', function () {
        $timeout.cancel(successCycle);
        $timeout.cancel(errorCycle);
    });
}

clusterMonitorCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', 'Notification'];
glanceApp.controller("clusterMonitorCtrl", clusterMonitorCtrl);