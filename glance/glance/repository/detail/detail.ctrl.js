(function () {
    'use strict';
    angular.module('glance.repository')
        .controller('RepoDetailCtrl', RepoDetailCtrl);


    /* @ngInject */
    function RepoDetailCtrl($stateParams, repoBackend, $base64) {
        var self = this;
        var projectName = $stateParams.projectName;
        var repositoryName = $stateParams.repositoryName;

        self.repoDetail = {};
        self.tags = [];

        activate();

        function activate() {
            getRepoDetail(projectName, repositoryName);
            listTags(projectName, repositoryName);
        }

        function getRepoDetail(projectName, repositoryName) {
            repoBackend.getRepository(projectName, repositoryName)
                .then(function (data) {
                    self.repoDetail = data;
                    self.repoDetail.markdown = decodeURIComponent(escape($base64.decode(self.repoDetail.markdown)));
                })
        }

        function listTags(projectName, repositoryName) {
            repoBackend.listRepositoryTags(projectName, repositoryName)
                .then(function (data) {
                    self.tags = data;
                })
        }

        self.fields =
            [
                {
                    type: 'string',
                    default: '1111',
                    label: 'Name',
                    descrition: 'demo demo'
                },
                {
                    type: 'int',
                    default: 300,
                    label: '22222',
                    descrition: 'demo demo',
                    required: true
                },
                {
                    type: 'boolean',
                    default: true,
                    label: 'Animal',
                    descrition: 'boolean boolean'
                },
                {
                    type: 'multiline',
                    default: '1231332',
                    label: 'textarea',
                    descrition: 'demo demo'
                },
                {
                    type: 'enum',
                    default: 'a',
                    label: 'enum',
                    descrition: 'demo demo',
                    options: ['a', 'b'],
                    required: true
                },
                {
                    type: 'service',
                    label: 'service',
                    descrition: 'demo demo'
                },
                {
                    type: 'password',
                    label: 'password',
                    default: 1234123,
                    descrition: 'demo demo'
                }
            ];
    }
})();