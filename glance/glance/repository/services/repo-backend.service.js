(function () {
    'use strict';
    angular.module('glance.repository')
        .factory('repoBackend', repoBackend);

    /* @ngInject */
    function repoBackend(gHttp) {
        //////
        return {
            listRepositories: listRepositories,
            getRepository: getRepository,
            updateRepository: updateRepository,
            listRepositoryTags: listRepositoryTags,
            listCategories: listCategories
        };

        function listRepositories() {
            return gHttp.Resource('repo.repositories').get();
        }

        function getRepository(proejctName, repositoryName) {
            return gHttp.Resource('repo.repository', {
                proejct_name: proejctName,
                repository_name: repositoryName
            }).get();
        }

        function updateRepository(proejctName, repositoryName, data) {
            return gHttp.Resource('repo.repository', {
                proejct_name: proejctName,
                repository_name: repositoryName
            }).put(data);
        }

        function listRepositoryTags(proejctName, repositoryName) {
            return gHttp.Resource('repo.repositoryTags', {
                proejct_name: proejctName,
                repository_name: repositoryName
            }).get();
        }

        function listCategories() {
            return gHttp.Resource('repo.repositoryCategories').get();
        }
    }
})();