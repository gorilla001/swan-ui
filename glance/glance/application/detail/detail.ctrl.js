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
        self.redeploy = redeploy;
        self.delete = deleteApp;
        self.upContainerModal = upContainerModal;
        self.createCanary = createCanary;
        self.undo = undo;
        
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
        }

        /*
         启动操作
         */
        function start(clusterId, appId) {
            var data = {};
            appcurd.start(data, clusterId, appId)
        }

        /*
         恢复操作
         */
        function redeploy(clusterId, appId) {
            var data = {};
            appcurd.redeploy(data, clusterId, appId)
        }

        /*
         删除操作
         */
        function deleteApp(clusterId, appId) {
            appcurd.del(clusterId, appId)
        }

        /*
         扩展操作
         */
        function upContainerModal(ev, clusterId, appId, instanceNum) {
            appcurd.updateContainer(ev, instanceNum, clusterId, appId);
        }

        /*
         新建灰度操作
         */
        function createCanary(ev, clusterId, appId, formData) {
            formData.portMappings = formData.ports;
            appcurd.createCanary(ev, formData, clusterId, appId);
        }

        /*
         撤销操作
         */
        function undo(clusterId, appId){
            var data = {};
            appcurd.undo(data, clusterId, appId)
        }
        
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