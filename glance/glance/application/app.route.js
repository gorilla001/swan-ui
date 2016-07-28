(function () {
    'use strict';
    angular.module('glance.app')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('app', {
                url: '/app',
                template: '<ui-view/>',
                targetState: 'list'
            })
            .state('app.create', {
                url: '/create?url&version',
                templateUrl: '/glance/application/createupdate/create-update.html',
                controller: 'CreateAppCtrl as createAppCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    app: function () {
                        return null
                    }
                }
            })
            .state('app.update', {
                url: '/:cluster_id/:app_id/update',
                templateUrl: '/glance/application/createupdate/create-update.html',
                controller: 'CreateAppCtrl as createAppCtrl',
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    app: getAppInfo
                }
            })
            .state('app.list', {
                url: '/list',
                templateUrl: '/glance/application/list/list.html',
                controller: 'ListAppCtrl as listappctrl',
                targetState: 'my'
            })
            .state('app.list.my', {
                url: '/my?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/application/list/apps-table.html',
                controller: 'AppsTableCtrl as appsTableCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    apps: listApp,
                    groups: function () {
                        return null;
                    },
                    target: function () {
                        return 'my'
                    }
               }
            })
            .state('app.list.group', {
                url: '/group?per_page&page&order&keywords&sort_by&clusterId&groupId',
                templateUrl: '/glance/application/list/apps-table.html',
                controller: 'AppsTableCtrl as appsTableCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    groups: listGroups,
                    apps: listGroupApp,
                    target: function () {
                        return 'group'
                    }
                }
            })
            .state('app.detail', {
                url: '/:cluster_id/:app_id',
                templateUrl: '/glance/application/detail/detail.html',
                controller: 'DetailAppCtrl as detailAppCtrl',
                targetState: 'config',
                resolve: {
                    appInfo: getAppInfo
                }
            })
            .state('app.detail.instance', {
                url: '/instance',
                templateUrl: '/glance/application/detail/instance.html',
                controller: 'InstanceAppCtrl as instanceAppCtrl'
            })
            .state('app.detail.monitoring', {
                url: '/monitoring',
                templateUrl: '/glance/application/detail/monitoring.html',
                controller: 'MonitorAppCtrl as monitorAppCtrl'
            })
            .state('app.detail.config', {
                url: '/config',
                templateUrl: '/glance/application/detail/config.html',
                controller: 'ConfigAppCtrl as configAppCtrl'
            })
            .state('app.detail.event', {
                url: '/event',
                templateUrl: '/glance/application/detail/event.html',
                controller: 'EventAppCtrl as eventAppCtrl'
            })
            .state('app.detail.debug', {
                url: '/debug',
                templateUrl: '/glance/application/detail/debug.html',
                controller: 'DebugAppCtrl as debugAppCtrl'
            })
            .state('app.detail.version', {
                url: '/version',
                templateUrl: '/glance/application/detail/version.html',
                controller: 'VersionAppCtrl as versionAppCtrl'
            });
            // .state('app.detail.canary', {
            //     url: '/canary',
            //     templateUrl: '/glance/application/detail/canary.html',
            //     controller: 'CanaryCtrl as canaryCtrl'
            // });
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
    function listApp($stateParams, appservice, utils) {
        return appservice.listApps(utils.encodeQueryParams($stateParams))
    }
    

    /* @ngInject */
    function listGroupApp(appservice, $stateParams, utils) {

        //encode Params of listGroupApp Ajax
        function encodeGroupAppsParams($stateParams) {
            var params = utils.encodeQueryParams($stateParams);

            if ($stateParams.clusterId) {
                params.clusterId = $stateParams.clusterId;
            }

            if ($stateParams.groupId) {
                params.groupId = $stateParams.groupId;
            }

            return params;
        }

        if ($stateParams.clusterId) {
            return appservice.listClusterApps(encodeGroupAppsParams($stateParams), $stateParams.clusterId)
        } else {
            return {}
        }
    }


})();