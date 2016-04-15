/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ConfigAppCtrl', ConfigAppCtrl);

    ConfigAppCtrl.$inject = ['gHttp', '$scope', 'clusterBackendService', '$stateParams'];

    function ConfigAppCtrl(gHttp, $scope, clusterBackendService, $stateParams) {
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

        function activate(){
            listGateAndProxy();
            checkDemoGroup();
        }

        function listGateAndProxy() {
            gHttp.Resource('cluster.cluster', {cluster_id: $scope.appStatus.cid}).get().then(function (data) {
                for (var i = 0; i < data.nodes.length; i++) {
                    if (data.nodes[i].role != 'master' || data.cluster_type == '1_master') {
                        self.listNodesIp.push(data.nodes[i].ip);
                        if (self.listNodesIp.length > 1)return
                    }
                }
            })
        }

        function checkDemoGroup(){
            clusterBackendService.getCluster($stateParams.cluster_id)
                .then(function(data){
                    if(data.is_demo_group){
                        self.isGroupFlag = true;
                    }
                })
        }

    }
})();