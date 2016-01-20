/**
 * Created by myu on 15-10-21.
 */
/*global
 glanceApp, appMonitorCtrl, $
 */
glanceApp.controller("appMonitorCtrl", appMonitorCtrl);

appMonitorCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp'];

function appMonitorCtrl($scope, $rootScope, glanceHttp) {
    "use strict";
    $rootScope.appTabFlag = "appMonitor";
    $scope.appMonitors = {};
    
    initMonitor();
    $scope.$on('refreshAppData', function() {
        initMonitor(false);
    });

    function initMonitor(loading) {
        glanceHttp.ajaxGet(['metrics.appmonit', {
            clusterID: $scope.appInfo.clusterId,
            aliase: $scope.appInfo.aliase
        }], function (data) {
            $scope.errorCode = data.code;
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
        }, undefined, null, function (data) {
            $scope.errorCode = data.code;
        }, loading);
    }

}
