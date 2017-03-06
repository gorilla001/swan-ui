(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {
        $stateProvider
            .state('app', {
                url: '/apps',
                templateUrl: '/glance/items/list/list.html',
                controller: 'ListAppCtrl as listappctrl',
		resolve: {
			apps: listItems,
		},
            });
    }

    /* @ngInject */
    function getAppInfo(appservice, $stateParams) {
        return appservice.getApp($stateParams.cluster_id, $stateParams.app_id)
    }

    /* @ngInject */
    function listItems($stateParams, appservice, utils) {
        appservice.listApps(utils.encodeQueryParams($stateParams))
	return
    }
})();
