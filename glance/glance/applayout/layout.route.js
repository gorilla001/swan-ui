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
                templateUrl: '/glance/applayout/createupdate/create-update.html',
                controller: 'LayoutCreateCtrl as layoutCreateCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    stack: function () {
                        return 'create'
                    }
                }
            })
            .state('layout.update', {
                url: '/update/:cluster_id/:stack_id',
                templateUrl: '/glance/applayout/createupdate/create-update.html',
                controller: 'LayoutCreateCtrl as layoutCreateCtrl',
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    stack: getStack
                }
            });

        /* @ngInject */
        function listStacks(layoutBackend) {
            return layoutBackend.list();
        }

        /* @ngInject */
        function listClusters(gHttp) {
            return gHttp.Resource('cluster.clusters').get()
        }

        /* @ngInject */
        function getStack(layoutBackend, $stateParams) {
            return layoutBackend.getStack($stateParams.cluster_id, $stateParams.stack_id)
        }
    }
})();
