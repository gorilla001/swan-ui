(function () {
    'use strict';
    angular.module('glance.dashboard')
        .config(route);

    /* @ngInject */
    function route($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/glance/dashboard/dashboard.html',
                controller: 'DashboardCtrl as dashboardCtrl'
            });
    }
})();
