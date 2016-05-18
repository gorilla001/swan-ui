(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoDetailCtrl', RepoDetailCtrl);

    /* @ngInject */
    function RepoDetailCtrl($stateParams, repoBackend, $base64, clusterCurd, $state, Notification) {
        var self = this;
        var projectName = $stateParams.projectName;
        var repositoryName = $stateParams.repositoryName;

        self.form = {
            app: {
                appName: $stateParams.repositoryName || '',
                imageVersion: '',
                clusterId: null,
                cpus: 0.1,
                mem: 16,
                instances: 1
            },
            answers: {},
            dockerCompose: "",
            marathonConfig: "",
            catalog: ""
        };
        self.tags = [];
        self.clusters = [];
        self.questions = [];
        self.memPower = Math.log(self.form.app.mem)/Math.log(2);
        self.pow = Math.pow;
        self.deploy = deploy;

        activate();

        function activate() {
            getRepoDetail(projectName, repositoryName);
            listTags(projectName, repositoryName);
            listClusters()
        }

        function getRepoDetail(projectName, repositoryName) {
            repoBackend.getRepository(projectName, repositoryName)
                .then(function (data) {
                    self.markdown = decodeURIComponent(escape($base64.decode(data.readme)));
                    self.form.dockerCompose = data.dockerCompose;
                    self.form.marathonConfig = data.marathonConfig;
                    self.form.catalog = data.catalog;
                    if (data.questions) {
                        self.questions = angular.fromJson(data.questions);
                    }
                })
        }

        function listTags(projectName, repositoryName) {
            repoBackend.listRepositoryTags(projectName, repositoryName)
                .then(function (data) {
                    self.tags = data;
                })
        }

        function listClusters() {
            clusterCurd.listClusterLables().then(function (data) {
                self.clusters = data
            });
        }

        function deploy() {
            if (self.questions.length) {
                angular.forEach(self.questions, function (item, index) {
                    self.form.answers[item.variable] = item.default;
                });
            }

            self.form.app.clusterId = self.form.app.clusterId.toString();
            self.form.app.mem = Math.pow(2, self.memPower);

            repoBackend.deployRepo($stateParams.projectName, $stateParams.repositoryName, self.form)
                .then(function (data) {
                    Notification.success(self.form.app.appName + ' 部署成功');
                    $state.go('app.list.my')
                });
        }
    }
})();