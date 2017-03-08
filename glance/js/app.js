var glanceApp = angular.module('glance',
    [
        'ngCookies',
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ngSocket',
        'infinite-scroll',
        'ngSanitize',
        'isteven-multi-select',
        'ui.bootstrap.datetimepicker',
        'ui-notification',
        'ngTable',
        'glance.utils',
        'glance.app',
        'ngMaterial',
	'lfNgMdFileInput',
        'glance.dashboard'
    ]);

glanceApp.config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider','NotificationProvider',
    function ($stateProvider, $urlRouterProvider, $interpolateProvider, $locationProvider, NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            positionX: 'right',
            positionY: 'top',
            replaceMessage: true,
            startTop: 20,
            startRight: 260
        });

        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('404', {
                views: {
                    '': {
                        templateUrl: '/views/common/notFound.html'
                    }
                }
            });


        $locationProvider.html5Mode(false);

        $interpolateProvider.startSymbol('{/');
        $interpolateProvider.endSymbol('/}');
    }]);
