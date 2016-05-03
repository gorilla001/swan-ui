(function () {
    'use strict';
    angular.module('glance.image')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {

        $stateProvider
            .state('image', {
                url: '/image',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('image.list', {
                url: '/list?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/image/list/list.html',
                controller: 'ImageListCtrl as imageListCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    project: listProjects
                }
            })
            .state('image.create', {
                url: '/image/create',
                templateUrl: '/glance/image/create/create.html',
                controller: 'ImageCreateCtrl as imageCreateCtrl',
            })
            .state('image.detail', {
                url: '/image/detail/:projectId',
                templateUrl: '/glance/image/detail/detail.html',
                controller: 'ImageDetailCtrl as imageDetailCtrl',
                resolve: {
                    project: getProject
                },
                targetState: 'version'
            })
            .state('image.detail.version', {
                url: '/version',
                templateUrl: '/glance/image/detail/version.html',
                controller: 'ImageDetailVersionCtrl as imageDetailVersionCtrl'
            })
            .state('image.detail.brief', {
                url: '/brief',
                templateUrl: '/glance/image/detail/brief.html',
                controller: 'ImageDetailBriefCtrl as imageDetailBriefCtrl'
            })
            .state('image.detail.setting', {
                url: '/setting',
                templateUrl: '/glance/image/detail/setting.html',
                controller: 'ImageDetailSettingCtrl as imageDetailSettingCtrl'
            });

    }

    /* @ngInject */
    function getProject($stateParams, imageBackend) {
        return imageBackend.getProject($stateParams.projectId);
    }

    /* @ngInject */
    function listProjects($stateParams, imageBackend, utils) {
        return imageBackend.listProjects(utils.encodeQueryParams($stateParams));
    }
})();
