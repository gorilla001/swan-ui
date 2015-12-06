/**
 * Created by myu on 15-10-21.
 */
/*global
 glanceApp, appMonitorCtrl, $
 */
glanceApp.controller("appMonitorCtrl", appMonitorCtrl);

appMonitorCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'glanceHttp'];

function appMonitorCtrl($scope, $rootScope, $timeout, glanceHttp) {
    "use strict";
    $rootScope.appTabFlag = "appMonitor";
    $scope.appMonitors = {};

    var successPromise, errorPromise;

    function initMonitor() {
        glanceHttp.ajaxGet(['metrics.appmonit', {
            clusterID: $scope.appInfo.clusterId,
            appName: $scope.appInfo.name
        }], function (data) {
            if (data.data) {
                $scope.cpuUsedCores = 0;
                $scope.cpuShareCores = 0;
                $scope.memoryUsed = 0;
                $scope.memoryTotal = 0;
                $scope.appMonitors = data.data;
                angular.forEach($scope.appMonitors, function (appMonitor) {
                    $scope.cpuUsedCores += appMonitor.cpuUsedCores;
                    $scope.cpuShareCores += appMonitor.cpuShareCores;
                    $scope.memoryUsed += appMonitor.memoryUsed;
                    $scope.memoryTotal += appMonitor.memoryTotal;
                })
            }
            successPromise = $timeout(initMonitor, 3000);
        }, undefined, null, function (data) {
            if (data.code === 1) {
                errorPromise = $timeout(initMonitor, 3000);
            }
        });
    }

    $scope.$on('$destroy', function () {
        $timeout.cancel(successPromise);
        $timeout.cancel(errorPromise);
    });

    $scope.getAppInfoPromise.then(initMonitor);
}
