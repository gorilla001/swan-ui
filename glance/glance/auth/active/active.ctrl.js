(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('ActiveCtrl', ActiveCtrl);

    /* @ngInject */
    function ActiveCtrl($stateParams, authBackend) {
        var self = this;
        self.resultMsg;
        
        activate();

        function activate() {
            return authBackend.active($stateParams.active)
                .then(function(data) {
                    self.resultMsg = "激活成功！";
                }, function(res) {
                    self.resultMsg = "激活失败！";
                });
        };

    }
})();