/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DetailAppCtrl', DetailAppCtrl);

    DetailAppCtrl.$inject = ['appInfo', 'appStatus', 'appcurd', 'appservice', 'appModal', '$scope', "$stateParams", "$timeout"];

    function DetailAppCtrl(appInfo, appStatus, appcurd, appservice, appModal, $scope, $stateParams, $timeout) {
        var self = this;
        ///

        self.APP_STATUS = APP_STATUS;

        self.appInfo = appInfo;
        self.appStatus = appStatus;
        $scope.appStatus = appStatus;

        var refreshInterval = 5000;
        var timeoutPromise = $timeout(refreshData, refreshInterval);
        
        $scope.$on('$destroy', function () {
            self.isDestroy = true;
            $timeout.cancel(timeoutPromise);
        });
        /*
         停止操作
         */
        self.stop = function (clusterId, appId) {
            var data = {};
            appcurd.stop(data, clusterId, appId)
        };

        /*
         启动操作
         */
        self.start = function (clusterId, appId) {
            var data = {};
            appcurd.start(data, clusterId, appId)
        };

        /*
         恢复操作
         */
        self.undo = function (clusterId, appId) {
            var data = {};
            appcurd.undo(data, clusterId, appId)
        };

        /*
         删除操作
         */
        self.delete = function (clusterId, appId) {
            appcurd.del(clusterId, appId)
        };

        self.openUpContainerModal = function (clusterId, appId, instanceNum) {
            appModal.openUpContainerModal(instanceNum, clusterId, appId);
        };
        
        function refreshData() {
            if (!self.isDestroy) {
                appservice.getAppStatus($stateParams.cluster_id, $stateParams.app_id, '').then(function (data) {
                    self.appStatus = data;
                    appservice.getApp($stateParams.cluster_id, $stateParams.app_id, '').then(function (data) {
                        self.appInfo = data;
                    });
                    $scope.$broadcast('refreshAppData');
                    timeoutPromise = $timeout(refreshData, refreshInterval);
                }).catch(function() {
                    timeoutPromise = $timeout(refreshData, refreshInterval);
                })
            }
        }

    }
})();