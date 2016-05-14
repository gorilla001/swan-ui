(function () {
    'use strict';
    angular.module('glance.repository')
        .config(route);

    /* @ngInject */
    function route($stateProvider) {

        $stateProvider
            .state('repository', {
                url: '/repository',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('repository.list', {
                url: '/list',
                templateUrl: '/glance/repository/list/list.html',
                controller: 'RepoListCtrl as repoListCtrl'
            })
            .state('repository.detail', {
                url: '/detail/:projectName/:repositoryName',
                templateUrl: '/glance/repository/detail/detail.html',
                controller: 'RepoDetailCtrl as repoDetailCtrl'
            });
    }
})();
