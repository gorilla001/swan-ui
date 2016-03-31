(function () {
    'use strict';
    angular.module('glance.repository')
        .config(route);

    /* @ngInject */
    function route($stateProvider) {

        $stateProvider
            .state('repositoryList', {
                url: '/repository',
                views: {
                    '': {
                        templateUrl: '/glance/repository/list/list.html',
                        controller: 'RepoListCtrl as repoListCtrl'
                    }
                }
            })
            .state('repositoryDetail', {
                url: '/repository/detail/:projectName/:repositoryName',
                views: {
                    '': {
                        templateUrl: '/glance/repository/detail/detail.html',
                        controller: 'RepoDetailCtrl as repoDetailCtrl'
                    }
                }
            });
    }
})();
