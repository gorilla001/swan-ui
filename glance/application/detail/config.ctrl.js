/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ConfigAppCtrl', ConfigAppCtrl);

    ConfigAppCtrl.$inject = ['$rootScope', 'gHttp', '$scope'];

    function ConfigAppCtrl($rootScope, gHttp, $scope) {
        $rootScope.appTabFlag = "appConfig";
        var self = this;
        ///
        self.gateWays = [];
        self.proxyNodes = [];
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

        gHttp.Resource('cluster.cluster', {cluster_id: $scope.appStatus.cid}).get().then(function (data) {
            for (var i = 0; i < data.nodes.length; i++) {
                if (data.nodes[i].attributes.length) {
                    for (var j = 0; j < data.nodes[i].attributes.length; j++) {
                        if (data.nodes[i].attributes[j].attribute === 'gateway') {
                            self.gateWays.push(data.nodes[i]);
                        }

                        if (data.nodes[i].attributes[j].attribute === 'proxy') {
                            self.proxyNodes.push(data.nodes[i]);
                        }
                    }
                }
            }

            console.log(self.proxyNodes);
            console.log(self.gateWays)
        })
    }
})();