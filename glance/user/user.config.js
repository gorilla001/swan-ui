(function () {
    'use strict';
    angular.module('glance.user')
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('user', {
                url: '/user',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/user/center.html',
                        controller: 'UserCenterCtrl as userAppCtrl'
                    }
                }
            }).state('user.groups', {
                url: '/groups',
                views: {
                    'tabdetail': {
                        templateUrl: '/user/group/list.html',
                        controller: 'ListGroupCtrl as listGroupCtrl'
                    }
                }
            }).state('user.password', {
                url: '/password',
                views: {
                    'tabdetail': {
                        templateUrl: '/user/password/update.html',
                        controller: 'UpdatePasswordCtrl as updatePasswordCtrl'
                    }
                }
            })
    }
})();
