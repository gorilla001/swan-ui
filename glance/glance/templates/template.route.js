(function () {
    'use strict';
    angular.module('glance.template')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {
        $stateProvider
            .state('template', {
                url: '/templates',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('template.list', {
                url: '/list',
                templateUrl: '/glance/templates/list/list.html',
                controller: 'ListTmplCtrl as listtmplctrl',
            })
	    .state('template.create', {
                url: '/new',
                templateUrl: '/glance/templates/create/create.html',
                controller: 'CreateTmplCtrl as createTmplCtrl',
            })
	    .state('template.detail', {
		url: '/:template_id',
                templateUrl: '/glance/templates/detail/detail.html',
                controller: 'DetailTmplCtrl as detailTmplCtrl',
            })
	    .state('template.update', {
		url: "//:template_id/update",
                templateUrl: '/glance/templates/update/update.html',
		controller: 'UpdateTmplCtrl as updateTmplCtrl',
	    })
	    ; 
    }
})();
