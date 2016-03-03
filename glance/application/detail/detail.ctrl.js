/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('DetailAppCtrl', DetailAppCtrl);

    DetailAppCtrl.$inject = ['appInfo', 'appStatus', 'appcurd'];

    function DetailAppCtrl(appInfo, appStatus, appcurd) {
        var self = this;
        ///

        self.APP_STATUS = APP_STATUS;

        console.log("appInfo:",appInfo);
        console.log("appStatus:",appStatus);
        self.appInfo = appInfo;
        self.appStatus = appStatus;

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

    }
})();