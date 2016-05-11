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
                url: '/billings?per_page&page&order&sort_by&appname&starttime&endtime',
                views: {
                    'billings': {
                        templateUrl: '/glance/user/billing/list.html',
                        controller: 'ListBillingCtrl as listBillingCtrl'
                    }
                },
                resolve: {
                    billings: listBillings
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
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
                pnum: $stateParams.page,
                pcount: $stateParams.per_page
            };

            $stateParams.appname && (params.appname = $stateParams.appname);
            $stateParams.starttime && (params.starttime = $stateParams.starttime);
            $stateParams.endtime && (params.endtime = $stateParams.endtime);

            return params;
        }

        return userBackend.listBillings(encodeParams($stateParams));
    }
})();
