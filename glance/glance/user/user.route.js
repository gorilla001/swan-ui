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
                templateUrl: '/glance/user/center.html',
                controller: 'UserCenterCtrl as userAppCtrl'
            })
            .state('user.groups', {
                url: '/groups?per_page&page&order&sort_by',
                templateUrl: '/glance/user/group/list.html',
                controller: 'ListGroupCtrl as listGroupCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    groups: listGroups
                }
            })
            .state('user.password', {
                url: '/password',
                templateUrl: '/glance/user/password/update.html',
                controller: 'UpdatePasswordCtrl as updatePasswordCtrl'
            })
            .state('user.billings', {
                url: '/billings?per_page&page&order&sort_by&appname&starttime&endtime&cid',
                templateUrl: '/glance/user/billing/list.html',
                controller: 'ListBillingCtrl as listBillingCtrl',
                resolve: {
                    billings: listBillings,
                    clusters: listClusters,
                    apps: getAppList
                },
                defaultParams: {
                    per_page: 20,
                    page: 1,
                    starttime: function () {
                        var starttime = new Date();
                        starttime.setDate(starttime.getDate() - 7);
                        starttime.setHours(0, 0, 0, 0);
                        return parseInt(starttime.getTime() / 1000);
                    },
                    endtime: function () {
                        var endtime = new Date();
                        endtime.setHours(0, 0, 0, 0);
                        return parseInt(endtime.getTime() / 1000 + 24 * 60 * 60);
                    }
                }
            })
            .state('user.licence', {
                url: '/licence',
                templateUrl: '/glance/user/licence/detail.html',
                controller: 'LicenceDetailCtrl as licenceDetailCtrl'
            })
            .state('user.users', {
                url: '/users?per_page&page',
                templateUrl: '/glance/user/users/list.html',
                controller: 'ListUserCtrl as listUserCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1,
                },
                resolve: {
                    users: listUsers
                }
            })
            .state('createuser', {
                url: '/users/create',
                templateUrl: '/glance/user/users/create-user.html',
                controller: 'CreateUserCtrl as createUserCtrl',
            })
            .state('updateuser', {
                url: '/users/update/:user_id',
                templateUrl: '/glance/user/users/update-user.html',
                controller: 'UpdateUserCtrl as updateUserCtrl',
            })
            .state('resetuserpwd', {
                url: '/users/resetpwd/:user_id',
                templateUrl: '/glance/user/users/reset-pwd.html',
                controller: 'ResetPwdCtrl as resetPwdCtrl',
            })
            .state('user.registries', {
                url: '/registries?per_page&page',
                templateUrl: '/glance/user/registry/list.html',
                controller: 'ListRegistryCtrl as listRegistryCtrl',
                resolve: {
                    registries: listRegistries
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
                }
            })
            .state('createregistry', {
                url: '/registries/create',
                templateUrl: '/glance/user/registry/create-update.html',
                controller: 'CreateRegistryCtrl as createRegistryCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    registry: function () {
                        return null
                    }
                }
            })
            .state('updateregistry', {
                url: '/registries/:registry_id/update',
                templateUrl: '/glance/user/registry/create-update.html',
                controller: 'CreateRegistryCtrl as createRegistryCtrl',
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    registry: getRegistry
                }
            })
    }

    /* @ngInject */
    function listGroups($stateParams, userBackend, utils) {
        return userBackend.listGroups(utils.encodeQueryParams($stateParams));
    }
    
    /* @ngInject */
    function listUsers($stateParams, userBackend, utils) {
        return userBackend.listUsers(utils.encodeQueryParams($stateParams));
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
            if ($stateParams.starttime && $stateParams.starttime !== 'null') {
                params.starttime = $stateParams.starttime;
            }
            if ($stateParams.endtime && $stateParams.endtime !== 'null') {
                params.endtime = $stateParams.endtime;
            }

            return params;
        }

        return userBackend.listBillings(encodeParams($stateParams));
    }

    /* @ngInject */
    function getAppList(appservice) {
        return appservice.listApps();
    }

    /* @ngInject */
    function listClusters(clusterBackend) {
        return clusterBackend.listClusters();
    }

    /* @ngInject */
    function listRegistries(userBackend) {
        return userBackend.listRegistries();
    }

    /* @ngInject */
    function getRegistry(userBackend, $stateParams) {
        return userBackend.getRegistry($stateParams.registry_id);
    }
})();
