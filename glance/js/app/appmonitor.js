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
    var promise;

    $scope.initStat = function () {
        $('#appCpuStat').data({text: '无数据', percent: 0}).circliful();
        $('#appMemStat').data({text: '无数据', percent: 0}).circliful();
        $scope.initCircle();
    };

    $scope.initCircle = function () {
        glanceHttp.ajaxGet(['metrics.appmonit', {
            clusterID: $scope.appInfo.clusterId,
            appName: $scope.appInfo.name
        }], function (data) {
            var cpuUseds = 0, cpuTotals = 0, memUseds = 0, memTotals = 0, cpuPercent, cpuText, memPercent, memText, i;
            $scope.appStat = data.data;
            $scope.cpuCores = [];
            if ($scope.appStat) {
                for (i = 0; i < $scope.appStat.length; i += 1) {
                    if ($scope.appStat[i].cpuUsedCores !== undefined && $scope.appStat[i].cpuShareCores) {
                        $scope.appStat[i].cpuUsedCores = Number($scope.appStat[i].cpuUsedCores);
                        $scope.appStat[i].cpuShareCores = Number($scope.appStat[i].cpuShareCores.toFixed(1));
                        cpuUseds += $scope.appStat[i].cpuUsedCores;
                        cpuTotals += $scope.appStat[i].cpuShareCores;
                        $scope.cpuCores.push($scope.appStat[i].cpuShareCores);
                    }

                    if ($scope.appStat[i].memoryUsed && $scope.appStat[i].memoryTotal) {
                        memUseds += $scope.appStat[i].memoryUsed;
                        memTotals += $scope.appStat[i].memoryTotal;
                    }
                }

                if (cpuUseds !== undefined && cpuTotals) {
                    cpuPercent = (cpuUseds / cpuTotals * 100).toFixed(2);
                    cpuText = cpuPercent + "%";
                } else {
                    cpuPercent = 0;
                    cpuText = "0%";
                }

                if (memUseds && memTotals) {
                    memPercent = (memUseds / memTotals * 100).toFixed(2);
                    memText = memPercent + "%";
                } else {
                    memPercent = 0;
                    memText = "0%";
                }

                $('#appCpuStat').empty().removeData().attr({
                    'data-percent': cpuPercent,
                    'data-text': cpuText
                }).circliful();
                $('#appMemStat').empty().removeData().attr({
                    'data-percent': memPercent,
                    'data-text': memText
                }).circliful();
                promise = $timeout($scope.initCircle, 3000);
            } else {
                memPercent = 0;
                memText = "无数据";
                cpuPercent = 0;
                cpuText = "无数据";
                $('#appCpuStat').empty().removeData().attr({
                    'data-percent': cpuPercent,
                    'data-text': cpuText
                }).circliful();
                $('#appMemStat').empty().removeData().attr({
                    'data-percent': memPercent,
                    'data-text': memText
                }).circliful();
                promise = $timeout($scope.initCircle, 3000);
            }
        }, undefined, null, function () {
            return undefined;
        });
    };

    $scope.$on('$destroy', function () {
        $timeout.cancel(promise);
    });

    $scope.initStat();
}
