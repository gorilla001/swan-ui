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
                mem: 16
            },
            answers: {}
        };
        self.tags = [];
        self.clusters = [];
        self.questions = [];
        self.containerConfig = {
            cpu: {
                min: 1,
                max: 10,
                options: {
                    step: 1,
                    floor: 1,
                    ceil: 10,
                    showSelectionBar: true,
                    translate: function (value) {
                        return self.form.app.cpus = value / 10.0;
                    }
                }
            },
            mem: {
                min: 4,
                max: 12,
                options: {
                    step: 1,
                    floor: 4,
                    ceil: 12,
                    showSelectionBar: true,
                    translate: function (value) {
                        return self.form.app.mem = Math.pow(2, value);
                    }
                }
            }
        };
        self.cpuSlideValue = self.form.app.cpus * 10;
        self.memSlideValue = Math.log(self.form.app.mem) / Math.LN2;
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
                    self.markdown = decodeURIComponent(escape($base64.decode(data.markdown)));
                    if (data.sryCompose) {
                        self.questions = angular.fromJson(data.sryCompose);
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

            repoBackend.deployRepo($stateParams.projectName, $stateParams.repositoryName, self.form)
                .then(function (data) {
                    Notification.success(self.form.app.appName + ' 部署成功');
                    $state.go('applist.my')
                });
        }
    }
})();