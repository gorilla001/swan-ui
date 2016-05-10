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
                controller: 'LayoutListCtrl as layoutListCtrl'
            })
            .state('layout.create', {
                url: '/create',
                templateUrl: '/glance/applayout/create/create.html',
                controller: 'LayoutCreateCtrl as layoutCreateCtrl'
            });
    }
})();
