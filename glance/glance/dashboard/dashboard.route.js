(function () {
    'use strict';
    angular.module('glance.dashboard')
        .config(route);

    /* @ngInject */
    function route($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                template: '<ui-view/>',
                targetState: 'home'
            })
            .state('dashboard.home', {
                url: '/home',
                templateUrl: '/glance/dashboard/home/dashboard.html',
                controller: 'DashboardCtrl as dashboardCtrl'
            });
    }
})();
