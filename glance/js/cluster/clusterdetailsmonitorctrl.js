function clusterMonitorCtrl($scope, $stateParams, glanceHttp, $timeout, Notification) {
    $scope.showAppMetrics = false;
    var timeoutPromise;

    $scope.dropStatus = false;

    $scope.getClusterMonitor = function () {
        if (!$scope.isDestroy){
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

                    // Set app pull bar.
                    angular.element(document).find('.mCustomScrollbar').mCustomScrollbar();
                }
                timeoutPromise = $timeout($scope.getClusterMonitor, 10000);
                
            }, undefined, null, function (data) {
                $scope.errorCode = data.code;
                if (data.code === 1) {
                    timeoutPromise = $timeout($scope.getClusterMonitor, 10000);
                }
            }, false);
        }
    };

    $scope.getClusterMonitor();

    $scope.$on('$destroy', function () {
        $scope.isDestroy = true;
        $timeout.cancel(timeoutPromise);
    });
    $scope.dropShow = function() {
            $scope.dropStatus = !$scope.dropStatus;
        }
}

clusterMonitorCtrl.$inject = ['$scope', '$stateParams', 'glanceHttp', '$timeout', 'Notification'];
glanceApp.controller("clusterMonitorCtrl", clusterMonitorCtrl);
