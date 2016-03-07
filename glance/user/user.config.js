(function () {
    'use strict';
    angular.module('glance.user')
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('user', {
                url: '/user',
                views: {
                    '': {
                        templateUrl: '/user/center.html',
                        controller: 'UserCenterCtrl as userAppCtrl'
                    }
                }
            })
            
    }
})();