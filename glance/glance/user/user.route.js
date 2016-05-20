(function () {
    'use strict';
    angular.module('glance.user')
        .config(route);

    /* @ngInject */
    function route($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('user', {
                url: '/user',
                targetState: 'groups',
                views: {
                    '': {
                        templateUrl: '/glance/user/center.html',
                        controller: 'UserCenterCtrl as userAppCtrl'
                    }
                }
            }).state('user.groups', {
                url: '/groups?per_page&page&order&sort_by',
                views: {
                    'groups': {
                        templateUrl: '/glance/user/group/list.html',
                        controller: 'ListGroupCtrl as listGroupCtrl'
                    }
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    groups: listGroups
                }
            }).state('user.password', {
                url: '/password',
                views: {
                    'password': {
                        templateUrl: '/glance/user/password/update.html',
                        controller: 'UpdatePasswordCtrl as updatePasswordCtrl'
                    }
                }
            }).state('user.billings', {
                url: '/billings?per_page&page&order&sort_by&appname&starttime&endtime&cid',
                views: {
                    'billings': {
                        templateUrl: '/glance/user/billing/list.html',
                        controller: 'ListBillingCtrl as listBillingCtrl'
                    }
                },
                resolve: {
                    billings: listBillings,
                    clusters: listClusters,
                    apps: getAppList
                },
                defaultParams: {
                    per_page: 20,
                    page: 1,
                    starttime: function() {
                        var starttime = new Date();
                        starttime.setDate(starttime.getDate() - 7);
                        starttime.setHours(0, 0, 0, 0);
                        return parseInt(starttime.getTime() / 1000);
                    },
                    endtime: function() {
                        var endtime = new Date();
                        endtime.setHours(0, 0, 0, 0);
                        return parseInt(endtime.getTime() / 1000 + 24 * 60 * 60);
                    }
                }
            })
    }

    /* @ngInject */
    function listGroups($stateParams, userBackend, utils) {
        return userBackend.listGroups(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function listBillings($stateParams, userBackend) {
        function encodeParams($stateParams) {
            var params = {
                page: $stateParams.page,
                per_page: $stateParams.per_page
            };

            $stateParams.cid && (params.cid = $stateParams.cid);
            $stateParams.order && (params.order = $stateParams.order);
            $stateParams.sort_by && (params.sort_by = $stateParams.sort_by);
            $stateParams.appname && (params.appname = $stateParams.appname);
            $stateParams.starttime && (params.starttime = $stateParams.starttime);
            $stateParams.endtime && (params.endtime = $stateParams.endtime);

            return params;
        }

        return userBackend.listBillings(encodeParams($stateParams));
    }

    /* @ngInject */
    function getAppList(appservice) {
        return appservice.listApps();
    }

    /* @ngInject */
    function listClusters(clusterBackendService) {
        return clusterBackendService.listClusters();
    }
})();
