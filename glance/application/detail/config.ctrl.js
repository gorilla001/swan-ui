/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ConfigAppCtrl', ConfigAppCtrl);

    ConfigAppCtrl.$inject = ['$rootScope'];

    function ConfigAppCtrl($rootScope) {
        $rootScope.appTabFlag = "appConfig";
        var self = this;
        ///

        self.portType = {
            "1": "对内",
            "2": "对外"
        };

        self.protocolType = {
            "1": "TCP",
            "2": "HTTP"
        };

        self.networkText = {
            BRIDGE: "网桥模式",
            HOST: "HOST 模式"
        };
    }
})();