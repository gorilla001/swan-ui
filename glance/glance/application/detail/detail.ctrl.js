/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DetailAppCtrl', DetailAppCtrl);

    /* @ngInject */
    function DetailAppCtrl(appInfo, appStatus, appcurd, appservice, $scope, $stateParams, timing, $q) {
        var self = this;
        
        self.APP_STATUS = APP_STATUS;
        self.APP_FAIL_RESULT = APP_FAIL_RESULT;

        self.appInfo = appInfo;
        self.appStatus = appStatus;
        self.stop = stop;
        self.start = start;
        self.undo = undo;
        self.delete = deleteApp;
        self.upContainerModal = upContainerModal;
        
        activate();
        
        function activate() {
            timing.start($scope, refreshData, 5000);
        }
        
        /*
         停止操作
         */
        function stop(clusterId, appId) {
            var data = {};
            appcurd.stop(data, clusterId, appId)
        };

        /*
         启动操作
         */
        function start(clusterId, appId) {
            var data = {};
            appcurd.start(data, clusterId, appId)
        };

        /*
         恢复操作
         */
        function undo(clusterId, appId) {
            var data = {};
            appcurd.undo(data, clusterId, appId)
        };

        /*
         删除操作
         */
        function deleteApp(clusterId, appId) {
            appcurd.del(clusterId, appId)
        };

        function upContainerModal(ev, clusterId, appId, instanceNum) {
            appcurd.updateContainer(ev, instanceNum, clusterId, appId);
        };
        
        
        function refreshData() {
            var deferred = $q.defer();
            appservice.getAppStatus($stateParams.cluster_id, $stateParams.app_id, '').then(function (data) {
                self.appStatus = data;
                $scope.appStatus = data;
                appservice.getApp($stateParams.cluster_id, $stateParams.app_id, '').then(function (data) {
                    self.appInfo = data;
                    $scope.appInfo = data;
                    deferred.resolve();
                });
                $scope.$broadcast('refreshAppData');
            });
            return deferred.promise;
        }

    }
})();