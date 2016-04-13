(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('appcreate', {
                url: '/app/create?url&version',
                views: {
                    '': {
                        templateUrl: '/glance/application/createupdate/create-update.html',
                        controller: 'CreateAppCtrl as createAppCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    app: function () {
                        return null
                    }
                }
            })
            .state('appupdate', {
                url: '/app/:cluster_id/:app_id/update',
                views: {
                    '': {
                        templateUrl: '/glance/application/createupdate/create-update.html',
                        controller: 'CreateAppCtrl as createAppCtrl',
                    }
                },
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    app: getAppInfo
                }
            })
            .state('applist', {
                url: '/apps',
                views: {
                    '': {
                        templateUrl: '/glance/application/list/list.html',
                        controller: 'ListAppCtrl as listappctrl'
                    }
                }
            })
            .state('applist.my', {
                url: '/apps/my',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/list/my.html',
                        controller: 'MyAppsCtrl as myAppsCtrl'
                    }
                },
                resolve: {
                    clusters: listClusters
                }
            })
            .state('applist.group', {
                url: '/apps/group',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/list/group.html',
                        controller: 'GroupAppsCtrl as groupAppsCtrl'
                    }
                },
                resolve: {
                    clusters: listClusters,
                    groups: listGroups
                }
            })
            .state('appdetails', {
                url: '/app/:cluster_id/:app_id',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/glance/application/detail/detail.html',
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
                        templateUrl: '/glance/application/detail/instance.html',
                        controller: 'InstanceAppCtrl as instanceAppCtrl'
                    }
                }
            })
            .state('appdetails.monitoring', {
                url: '/monitoring',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/detail/monitoring.html',
                        controller: 'MonitorAppCtrl as monitorAppCtrl'
                    }
                }
            })
            .state('appdetails.config', {
                url: '/config',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/detail/config.html',
                        controller: 'ConfigAppCtrl as configAppCtrl'
                    }
                }
            })
            .state('appdetails.event', {
                url: '/event',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/detail/event.html',
                        controller: 'EventAppCtrl as eventAppCtrl'
                    }
                }
            })
            .state('appdetails.version', {
                url: '/version',
                views: {
                    'tabdetail': {
                        templateUrl: '/glance/application/detail/version.html',
                        controller: 'VersionAppCtrl as versionAppCtrl'
                    }
                }
            })
            .state('appwarningcreate', {
                url: '/appwarningcreate',
                views: {
                    '': {
                        templateUrl: '/glance/application/strategy/warning/createupdate/create-update.html',
                        controller: 'CreateWarningCtrl as createWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    warning: function () {
                        return null
                    }
                }
            })
            .state('appwarningupdate', {
                url: '/appwarningupdate',
                views: {
                    '': {
                        templateUrl: '/glance/application/strategy/warning/createupdate/create-update.html',
                        controller: 'CreateWarningCtrl as createWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    warning: function () {
                        ////
                    }
                }
            })
            .state('appstrategy', {
                url: '/appstrategy',
                views: {
                    '': {
                        templateUrl: '/glance/application/strategy/strategy.html'
                    }
                }
            })
            .state('appstrategy.warninglist', {
                url: '/warninglist',
                views: {
                    'strategyTab': {
                        templateUrl: '/glance/application/strategy/warning/list/list.html',
                        controller: 'WarningListCtrl as warningListCtrl'
                    }
                }
            });

    }

    /* @ngInject */
    function listClusters(gHttp) {
        return gHttp.Resource('cluster.clusters').get()
    }

    /* @ngInject */
    function listGroups(userBackend) {
        return userBackend.listGroups();
    }

    /* @ngInject */
    function getAppInfo(appservice, $stateParams) {
        return appservice.getApp($stateParams.cluster_id, $stateParams.app_id)
    }

    /* @ngInject */
    function getAppStatus(appservice, $stateParams) {
        return appservice.getAppStatus($stateParams.cluster_id, $stateParams.app_id)
    }
})();