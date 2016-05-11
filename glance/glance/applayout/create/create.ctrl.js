(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutCreateCtrl', LayoutCreateCtrl);

    /* @ngInject */
    function LayoutCreateCtrl($state, Notification, clusterCurd, layoutBackend) {
        var self = this;

        self.form = {
            name: "",
            marathonConfig: "",
            compose: ""
        };
        self.listClusters = listClusters;
        self.create = create;

        function listClusters() {
            return clusterCurd.listClusterLables().then(function (data) {
                self.clusters = data
            });
        }

        function create() {
            layoutBackend.create(self.form, self.clusterId)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('创建成功');
                            $state.go('layout.list')
                        });
                })
        }
    }
})();