(function () {
    'use strict';
    angular.module('glance.image')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {

        $stateProvider
            .state('imageList', {
                url: '/image?per_page&page&order&keywords&sort_by',
                views: {
                    '': {
                        templateUrl: '/glance/image/list/list.html',
                        controller: 'ImageListCtrl as imageListCtrl'
                    }
                },
                resolve: {
                    data: listProjects
                }
            })
            .state('imageCreate', {
                url: '/image/create',
                views: {
                    '': {
                        templateUrl: '/glance/image/create/create.html',
                        controller: 'ImageCreateCtrl as imageCreateCtrl'
                    }
                }
            })
            .state('imageDetail', {
                url: '/image/detail/:projectId',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/glance/image/detail/detail.html',
                        controller: 'ImageDetailCtrl as imageDetailCtrl'
                    }
                },
                resolve: {
                    project: getProject
                }
            })
            .state('imageDetail.version', {
                url: '/version',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/glance/image/detail/version.html',
                        controller: 'ImageDetailVersionCtrl as imageDetailVersionCtrl'
                    }
                }
            })
            .state('imageDetail.brief', {
                url: '/brief',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/glance/image/detail/brief.html',
                        controller: 'ImageDetailBriefCtrl as imageDetailBriefCtrl'
                    }
                }
            })
            .state('imageDetail.setting', {
                url: '/setting',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/glance/image/detail/setting.html',
                        controller: 'ImageDetailSettingCtrl as imageDetailSettingCtrl'
                    }
                }
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
