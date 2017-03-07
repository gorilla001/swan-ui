(function () {
    'use strict';
    angular.module('glance.order')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {
        $stateProvider
            .state('order', {
                url: '/orders',
                templateUrl: '/glance/orders/list/list.html',
                controller: 'ListOrderCtrl as listorderctrl',
		resolve: {
			orders: listOrders,
		},
            });
    }

    /* @ngInject */
    function listOrders($stateParams, appservice, utils) {
	return
    }
})();
