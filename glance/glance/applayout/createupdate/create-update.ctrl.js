(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutCreateCtrl', LayoutCreateCtrl);

    /* @ngInject */
    function LayoutCreateCtrl($state, Notification, clusterCurd, layoutBackend, target, stack, $stateParams) {
        var self = this;
        self.target = target;

        self.form = {
            name: stack.name || "",
            marathonConfig: stack.marathonConfig || STACK_DEFAULT.SryunCompose || "",
            compose: stack.compose || STACK_DEFAULT.DockerCompose || ""
        };
        self.errorInfo = {
            compose: '',
            marathonConfig: ''
        };
        self.listClusters = listClusters;
        self.create = create;
        self.update = update;
        self.checkYaml = checkYaml;

        activate();

        function activate() {
            if (self.target === 'update') {
                listClusters()
                    .then(function (data) {
                        self.clusterId = stack.Cid
                    });
            }
        }

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

        function update() {
            layoutBackend.update(self.form, $stateParams.cluster_id, $stateParams.stack_id)
                .then(function (data) {
                    layoutBackend.deploy(self.clusterId, data.stackId)
                        .then(function (data) {
                            Notification.success('更新成功');
                            $state.go('layout.list')
                        });
                })
        }

        function checkYaml(name) {
            try {
                var doc = jsyaml.load(self.form[name]);
                self.errorInfo[name] = '';
                return true;
            } catch (err) {
                self.errorInfo[name] = err.message;
                return false;
            }
        }
    }
})();