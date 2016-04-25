(function () {
    'use strict';
    angular.module('glance.policy')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {

        $stateProvider
            .state('policy', {
                url: '/policy',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/glance/policy/common/policy.html'
                    }
                }
            })
            .state('policyWarningCreate', {
                url: '/appwarningcreate',
                views: {
                    '': {
                        templateUrl: '/glance/policy/appwarning/createupdate/create-update.html',
                        controller: 'CreateWarningCtrl as createWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    warning: function () {
                        return 'create'
                    }
                }
            })
            .state('policyWarningUpdate', {
                url: '/appwarningupdate?task_id',
                views: {
                    '': {
                        templateUrl: '/glance/policy/appwarning/createupdate/create-update.html',
                        controller: 'CreateWarningCtrl as createWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    warning: getTaskInfo
                }
            })
            .state('policy.appwarning', {
                url: '/appwarning',
                views: {
                    'policyTab': {
                        templateUrl: '/glance/policy/appwarning/warning-tab-view.html'
                    }
                }
            })
            .state('policy.appwarning.warninglist', {
                url: '/warninglist?per_page&page&order&keywords&sort_by&appalias',
                views: {
                    'warningContent': {
                        templateUrl: '/glance/policy/appwarning/list/list.html',
                        controller: 'WarningListCtrl as warningListCtrl'
                    }
                },
                resolve: {
                    data: warningList
                }
            })
            .state('policy.appwarning.warningevent', {
                url: '/warningevent?per_page&page&order&keywords&sort_by',
                views: {
                    'warningContent': {
                        templateUrl: '/glance/policy/appwarning/event/event.html',
                        controller: 'WarningEventCtrl as warningEventCtrl'
                    }
                },
                resolve: {
                    data: warningEvent
                }
            })
            .state('policy.apptimescaling', {
                url: '/apptimescaling',
                views: {
                    'policyTab': {
                        templateUrl: '/glance/policy/apptimescaling/scaling-tab-view.html'
                    }
                }
            })
            .state('policy.apptimescaling.scalinglist', {
                url: '/scalinglist?per_page&page&order&keywords&sort_by',
                views: {
                    'scalingContent': {
                        templateUrl: '/glance/policy/apptimescaling/list/list.html',
                        controller: 'ScalingListCtrl as scalingListCtrl'
                    }
                },
                resolve: {
                    data: scaleList
                }
            })
            .state('policy.apptimescaling.scalingevent', {
                url: '/scalingevent',
                views: {
                    'scalingContent': {
                        templateUrl: '/glance/policy/apptimescaling/event/event.html'
                    }
                }
            })
            .state('policyScalingCreate', {
                url: '/policyScalingCreate',
                views: {
                    '': {
                        templateUrl: '/glance/policy/apptimescaling/create/create.html',
                        controller: 'CreateScalingCtrl as createScalingCtrl'
                    }
                }
            })
            .state('policyLogWarningCreate', {
                url: '/policyLogWarningCreate',
                views: {
                    '': {
                        templateUrl: '/glance/policy/applogwarning/create/create.html',
                        controller: 'CreateLogWarningCtrl as createLogWarningCtrl'
                    }
                }
            })
            .state('policy.applogwarning', {
                url: '/applogwarning',
                views: {
                    'policyTab': {
                        templateUrl: '/glance/policy/applogwarning/log-tab-view.html'
                    }
                }
            })
            .state('policy.applogwarning.loglist', {
                url: '/loglist?per_page&page&order&keywords&sort_by',
                views: {
                    'logContent': {
                        templateUrl: '/glance/policy/applogwarning/list/list.html',
                        controller: 'LogWarningListCtrl as logWarningListCtrl'
                    }
                }
            })
            .state('policy.applogwarning.logevent', {
                url: '/logevent',
                views: {
                    'logContent': {
                        templateUrl: '/glance/policy/applogwarning/event/event.html'
                    }
                }
            });

    }

    /* @ngInject */
    function warningList(appWarningBackend, utils, $stateParams) {
        return appWarningBackend.warningList(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function getTaskInfo(appWarningBackend, $stateParams) {
        return appWarningBackend.getWarning($stateParams.task_id);
    }

    /* @ngInject */
    function warningEvent(appWarningBackend, utils, $stateParams) {
        return appWarningBackend.warningEvent(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function scaleList(appScalingBackend, utils, $stateParams) {
        return appScalingBackend.scaleList(utils.encodeQueryParams($stateParams));
    }
})();
