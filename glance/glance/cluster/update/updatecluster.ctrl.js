(function () {
    'use strict';

    angular.module('glance.cluster').controller('UpdateClusterCtrl', UpdateClusterCtrl);

    /*@ngInject*/
    function UpdateClusterCtrl($state, $stateParams, gHttp, userBackend,
                               clusterBackend, clusterDetail) {
        var self = this;

        self.cluster = clusterDetail;
        self.form = {
            "name": self.cluster.name,
            'groupId': self.cluster.group_id || ''
        };
        self.changeGroupDisabled = !!self.cluster.group_id;
        self.groups = [];

        self.updateCluster = updateCluster;

        activate();

        function activate() {
            userBackend.listGroups().then(function (data) {
                angular.forEach(data.groups, function (group) {
                    if (group.role.id == 1) {
                        self.groups.push(group);
                    }
                })
            });
        }

        function updateCluster() {
            var form = {};
            if(self.form.name != self.cluster.name) {
                form.name = self.form.name;
            }
            if(self.form.groupId !== "" && self.form.groupId != self.cluster.group_id) {
                form.group_id = self.form.groupId;
            }
            if(Object.keys(form).length) {
                clusterBackend.changeCluster($stateParams.clusterId, form).then(function() {
                    $state.go("cluster.detail.nodes", {"clusterId": $stateParams.clusterId});
                })
            } else {
                $state.go("cluster.detail.nodes", {"clusterId": $stateParams.clusterId});
            }
        }
    }
})();