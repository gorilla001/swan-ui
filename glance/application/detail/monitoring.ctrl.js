/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MonitorAppCtrl', MonitorAppCtrl);

    MonitorAppCtrl.$inject = ['$rootScope', 'gHttp', '$scope', 'glanceHttp'];

    function MonitorAppCtrl($rootScope, gHttp, $scope, glanceHttp) {
        var self = this;
        ///
        $rootScope.appTabFlag = "appMonitor";
        self.appMonitors = {};

        initMonitor();

        $scope.$on('refreshAppData', function () {
            initMonitor();
        });

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
            }, function (res) {
                self.errorCode = res.code;
            });
        }
    }
})();