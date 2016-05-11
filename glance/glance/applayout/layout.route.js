(function () {
    'use strict';
    angular.module('glance.layout')
        .config(route);

    /* @ngInject */
    function route($stateProvider) {

        $stateProvider
            .state('layout', {
                url: '/layout',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('layout.list', {
                url: '/list',
                templateUrl: '/glance/applayout/list/list.html',
                controller: 'LayoutListCtrl as layoutListCtrl',
                resolve: {
                    data: listStacks,
                    clusters: listClusters
                }
            })
            .state('layout.create', {
                url: '/create',
                templateUrl: '/glance/applayout/create/create.html',
                controller: 'LayoutCreateCtrl as layoutCreateCtrl'
            });

        /* @ngInject */
        function listStacks(layoutBackend) {
            return layoutBackend.list();
        }

        /* @ngInject */
        function listClusters(gHttp) {
            return gHttp.Resource('cluster.clusters').get()
        }
    }
})();
