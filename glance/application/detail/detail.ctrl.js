/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DetailAppCtrl', DetailAppCtrl);

    DetailAppCtrl.$inject = ['appInfo', 'appStatus', 'appcurd', 'appModal', '$scope'];

    function DetailAppCtrl(appInfo, appStatus, appcurd, appModal, $scope) {
        var self = this;
        ///

        self.APP_STATUS = APP_STATUS;

        self.appInfo = appInfo;
        self.appStatus = appStatus;
        $scope.appStatus = appStatus;

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

    }
})();