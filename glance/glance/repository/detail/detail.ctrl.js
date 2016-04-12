(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoDetailCtrl', RepoDetailCtrl);

    /* @ngInject */
    function RepoDetailCtrl($stateParams, repoBackend, $base64, clusterCurd, $state) {
        var self = this;
        var projectName = $stateParams.projectName;
        var repositoryName = $stateParams.repositoryName;

        self.form = {
            app: {
                appName: $stateParams.repositoryName || '',
                imageVersion: '',
                clusterId: null
            },
            answers: {}
        };
        self.tags = [];
        self.clusters = [];
        self.questions = [];
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
                .then(function(data){
                    Notification.success(self.form.apps.appName + ' 部署成功');
                    $state.go('applist.my')
                });
        }
    }
})();