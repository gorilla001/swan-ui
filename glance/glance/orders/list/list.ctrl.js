(function () {
    'use strict';
    angular.module('glance.order')
        .controller('ListOrderCtrl', ListOrderCtrl);

    /* @ngInject */
    function ListOrderCtrl(appcurd) {
        var self = this;
        

        /*
           删除操作
         */
        self.delete = function (clusterId, appId, target) {
            var state;
            state = target == 'my' ? 'app.list.my': 'app.list.group';
            appcurd.del(clusterId, appId, state);
        };

        self.upContainerModal = function (ev, clusterId, appId, instanceNum) {
            appcurd.updateContainer(ev, instanceNum, clusterId, appId);
        };

        /*
         创建灰度
         */
        // self.createCanary = function (ev, clusterId, appId, formData) {
        //     formData.portMappings = formData.ports;
        //     delete formData.ports;
        //     appcurd.createCanary(ev, formData, clusterId, appId);
        // };
    }
})();
