(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {
        $stateProvider
            .state('app', {
                url: '/apps',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('app.list', {
                url: '/list',
                templateUrl: '/glance/items/list/list.html',
                controller: 'ListAppCtrl as listappctrl',
            })
	    .state('app.create', {
                url: '/new',
                templateUrl: '/glance/items/create/create.html',
                controller: 'CreateAppCtrl as createAppCtrl',
            })
	    .state('app.health', {
		    url: '/new/health',
		    templateUrl: '/glance/items/create/health.html',
		    controller: 'CreateAppCtrl as createAppCtrl',
	    })
	    .state('app.env', {
		url: "/new/env",
		templateUrl: '/glance/items/create/env.html',
		controller: 'CreateAppCtrl as createAppCtrl',
	    })
	    .state('app.detail', {
		url: '/:app_id',
                templateUrl: '/glance/items/detail/detail.html',
                controller: 'DetailAppCtrl as detailAppCtrl',
            })
	    .state('app.task', {
		    url: '/:app_id/:task_id',
		    templateUrl: '/glance/items/detail/log.html',
		    controller: 'DetailAppCtrl as detailAppCtrl',
	    })
	    .state('app.update', {
		url: "//:app_id/update",
                templateUrl: '/glance/items/update/update.html',
		controller: 'UpdateAppCtrl as updateAppCtrl',
	    })
	    .state('app.updateStategy', {
		url: "//:app_id/update//stategy",
                templateUrl: '/glance/items/update/stategy.html',
		controller: 'UpdateAppCtrl as updateAppCtrl',
	    })
	    .state('app.deleteStategy', {
		url: "//:app_id/delete//stategy",
                templateUrl: '/glance/items/delete/stategy.html',
		controller: 'UpdateAppCtrl as updateAppCtrl',
	    })
	    .state('app.scale', {
		url: "//:app_id/scale",
                templateUrl: '/glance/items/scale/scale.html',
		controller: 'ScaleAppCtrl as scaleAppCtrl',
	    })
	    ; 
    }
})();
