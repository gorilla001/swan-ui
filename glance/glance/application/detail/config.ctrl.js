/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ConfigAppCtrl', ConfigAppCtrl);

    /* @ngInject*/
    function ConfigAppCtrl(clusterBackend, $stateParams) {
        var self = this;
        ///
        self.listNodesIp = [];
        self.protocolType = {
            "1": "TCP",
            "2": "HTTP"
        };
        self.networkText = {
            BRIDGE: "网桥模式",
            HOST: "HOST 模式"
        };
        self.specialUrl = APP_CONFIG_SPE_URL;

        activate();

        function activate() {
            listClusterNodes();
            checkDemoGroup();
        }

        function listClusterNodes() {
            clusterBackend.getCluster($stateParams.cluster_id)
                .then(function (data) {
                    var clusterType = data.cluster_type;
                    clusterBackend.listNodes($stateParams.cluster_id)
                        .then(function (data) {
                            for (var i = 0; i < data.nodes.length; i++) {
                                if (data.nodes[i].role != 'master' || clusterType === '1_master') {
                                    self.listNodesIp.push(data.nodes[i].ip);
                                    if (self.listNodesIp.length > 1)return
                                }
                            }
                        });
                });
        }

        function checkDemoGroup() {
            clusterBackend.getCluster($stateParams.cluster_id)
                .then(function (data) {
                    if (data.is_demo_group) {
                        self.isGroupFlag = true;
                    }
                })
        }

    }
})();