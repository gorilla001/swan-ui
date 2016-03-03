(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('createapp', {
                url: '/createapp',
                views: {
                    '': {
                        templateUrl: '/application/create/creat.html',
                        controller: 'CreateAppCtrl as createappctrl'
                    }
                }
            })
            .state('list', {
                url: '/listapp',
                views: {
                    '': {
                        templateUrl: '/application/list/list.html',
                        controller: 'ListAppCtrl as listappctrl'
                    }
                },
                resolve: {
                    listClusters: listClusters
                }
            })
            .state('detail', {
                url: '/detail/:cluster_id/:app_id',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/application/detail/detail.html',
                        controller: 'DetailAppCtrl as detailAppCtrl'
                    }
                },
                resolve: {
                    appInfo: getAppInfo,
                    appStatus: getAppStatus
                }
            })
            .state('detail.instance', {
                url: '/instance',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/instance.html',
                        controller: 'InstanceAppCtrl as instanceappctrl'
                    }
                }
            })
            .state('detail.monitoring', {
                url: '/monitoring',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/monitoring.html',
                        controller: 'MonitorAppCtrl as monitorappctrl'
                    }
                }
            })
            .state('detail.config', {
                url: '/config',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/config.html',
                        controller: 'ConfigAppCtrl as configAppCtrl'
                    }
                }
            })
            .state('detail.event', {
                url: '/event',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/event.html',
                        controller: 'EventAppCtrl as eventAppCtrl'
                    }
                }
            })
            .state('detail.version', {
                url: '/version',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/version.html',
                        controller: 'VersionAppCtrl as versionappctrl'
                    }
                }
            });

    }

    listClusters.$inject = ['gHttp'];
    function listClusters(gHttp) {
        return gHttp.Resource('cluster.clusters').get()
    }

    getAppInfo.$inject = ['appservice', '$stateParams'];
    function getAppInfo(appservice, $stateParams) {
        return appservice.getApp($stateParams.cluster_id, $stateParams.app_id)
    }

    getAppStatus.$inject = ['appservice', '$stateParams'];
    function getAppStatus(appservice, $stateParams) {
        return appservice.getAppStatus($stateParams.cluster_id, $stateParams.app_id)
    }
})();