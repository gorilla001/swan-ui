(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ListAppCtrl', ListAppCtrl);

    /* @ngInject */
    function ListAppCtrl(appcurd) {
        var self = this;
        self.APP_STATUS = APP_STATUS;
        

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
            appcurd.del(clusterId, appId);
        };

        /*
           重新部署操作
         */
        self.redeploy = function (clusterId, appId) {
            var data = {};
            appcurd.redeploy(data, clusterId, appId)
        };

        self.upContainerModal = function (clusterId, appId, instanceNum) {
            appcurd.updateContainer(instanceNum, clusterId, appId);
        };
    }
})();