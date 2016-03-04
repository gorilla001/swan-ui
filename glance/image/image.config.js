(function () {
    'use strict';
    angular.module('glance.image')
        .config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {

        $stateProvider
            .state('imageHome', {
                url: '/image',
                views: {
                    '': {
                        templateUrl: '/image/home/home.html',
                        controller: 'ImageHomeCtrl as imageHomeCtrl'
                    }
                }
            })
            .state('imageCreate', {
                url: '/image/create',
                views: {
                    '': {
                        templateUrl: '/image/create/create.html',
                        controller: 'ImageCreateCtrl as imageCreateCtrl'
                    }
                },
                resolve: {
                    listProjectsName: listProjectsName
                }
            })
            .state('imageDetail', {
                url: '/image/detail/:image_id',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/image/detail/detail.html',
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
                        templateUrl: '/image/detail/version.html',
                        controller: 'ImageDetailVersionCtrl as imageDetailVersionCtrl'
                    }
                }
            })
            .state('imageDetail.brief', {
                url: '/brief',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/image/detail/brief.html',
                        controller: 'ImageDetailBriefCtrl as imageDetailBriefCtrl'
                    }
                }
            })
            .state('imageDetail.setting', {
                url: '/setting',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/image/detail/setting.html',
                        controller: 'ImageDetailSettingCtrl as imageDetailSettingCtrl'
                    }
                }
            });

    }

    listProjectsName.$inject = ['imageservice'];
    function listProjectsName(imageservice) {
        var listProjectsName = [];
        return imageservice.listProjects().then(function (data) {
            angular.forEach(data, function (value, index) {
                listProjectsName.push(value.name)
            });
            return listProjectsName;
        })

    }

    getProject.$inject = ['$stateParams', 'imageservice'];
    function getProject($stateParams, imageservice) {
        return imageservice.getProject($stateParams.projectId);
    }
})();
