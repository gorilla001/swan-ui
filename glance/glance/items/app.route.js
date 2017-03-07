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
                resolve: {
                    apps: listItems,
                },
            })
	    .state('app.create', {
                url: '/new',
                templateUrl: '/glance/items/create/create.html',
                controller: 'CreateAppCtrl as createAppCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    app: function () {
                        return null
                    }
                }
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
