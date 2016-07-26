(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ListAppCtrl', ListAppCtrl);

    /* @ngInject */
    function ListAppCtrl(appcurd) {
        var self = this;
        

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
           撤销操作
         */
        self.undo = function (clusterId, appId) {
            var data = {};
            appcurd.undo(data, clusterId, appId)
        };

        /*
           删除操作
         */
        self.delete = function (clusterId, appId, target) {
            var state;
            state = target == 'my' ? 'app.list.my': 'app.list.group';
            appcurd.del(clusterId, appId, state);
        };

        /*
           恢复操作
         */
        self.redeploy = function (clusterId, appId) {
            var data = {};
            appcurd.redeploy(data, clusterId, appId)
        };

        self.upContainerModal = function (ev, clusterId, appId, instanceNum) {
            appcurd.updateContainer(ev, instanceNum, clusterId, appId);
        };

        /*
         创建灰度
         */
        self.createCanary = function (ev, clusterId, appId, formData) {
            formData.portMappings = formData.ports;
            delete formData.ports;
            appcurd.createCanary(ev, formData, clusterId, appId);
        };
    }
})();