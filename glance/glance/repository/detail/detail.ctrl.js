(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoDetailCtrl', RepoDetailCtrl);

    /* @ngInject */
    function RepoDetailCtrl($stateParams, repoBackend, $base64, clusterCurd) {
        var self = this;
        var projectName = $stateParams.projectName;
        var repositoryName = $stateParams.repositoryName;

        self.form = {
            name: '',
            category: ''
        };
        self.tags = [];
        self.clusters = [];
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
                    self.form = data;
                    self.markdown = decodeURIComponent(escape($base64.decode(self.form.markdown)));
                    if (data.sryCompose) {
                        self.form.questions = angular.fromJson(data.sryCompose);
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
            clusterCurd.listClusterLables().then(function(data){
                self.clusters = data
            });
        }

        function deploy() {
            ///
            console.log(self.form)
        }
    }
})();