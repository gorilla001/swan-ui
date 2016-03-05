(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('appcreate', {
                url: '/app/create',
                views: {
                    '': {
                        templateUrl: '/application/createupdate/create-update.html',
                        controller: 'CreateAppCtrl as createAppCtrl'
                    }
                },
                resolve: {
                    target: function () {return 'create'},
                    app: function () {return null}
                }
            })
            .state('appupdate', {
                url: '/app/:cluster_id/:app_id/update',
                views: {
                    '': {
                        templateUrl: '/application/createupdate/create-update.html',
                        controller: 'CreateAppCtrl as createAppCtrl',
                    }
                },
                resolve: {
                    target: function () {return 'update'},
                    app: getAppInfo
                }
            })
            .state('applist', {
                url: '/apps',
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
            .state('appdetails', {
                url: '/app/:cluster_id/:app_id',
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
            .state('appdetails.instance', {
                url: '/instance',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/instance.html',
                        controller: 'InstanceAppCtrl as instanceAppCtrl'
                    }
                }
            })
            .state('appdetails.monitoring', {
                url: '/monitoring',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/monitoring.html',
                        controller: 'MonitorAppCtrl as monitorAppCtrl'
                    }
                }
            })
            .state('appdetails.config', {
                url: '/config',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/config.html',
                        controller: 'ConfigAppCtrl as configAppCtrl'
                    }
                }
            })
            .state('appdetails.event', {
                url: '/event',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/event.html',
                        controller: 'EventAppCtrl as eventAppCtrl'
                    }
                }
            })
            .state('appdetails.version', {
                url: '/version',
                views: {
                    'tabdetail': {
                        templateUrl: '/application/detail/version.html',
                        controller: 'VersionAppCtrl as versionAppCtrl'
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