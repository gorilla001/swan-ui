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
                        templateUrl: '/glance/policy/applogwarning/createupdate/create-update.html',
                        controller: 'CreateLogWarningCtrl as createLogWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    logPolicy: function () {
                        return 'create'
                    }
                }
            })
            .state('policyLogWarningUpdate', {
                url: '/policyLogWarningUpdate?log_id',
                views: {
                    '': {
                        templateUrl: '/glance/policy/applogwarning/createupdate/create-update.html',
                        controller: 'CreateLogWarningCtrl as createLogWarningCtrl'
                    }
                },
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    logPolicy: getLogPolicyInfo
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
                },
                resolve: {
                    data: logList
                }
            })
            .state('policy.applogwarning.logevent', {
                url: '/logevent?per_page&page&order&keywords&sort_by',
                views: {
                    'logContent': {
                        templateUrl: '/glance/policy/applogwarning/event/event.html',
                        controller: 'EventLogListCtrl as eventLogListCtrl'
                    }
                },
                resolve: {
                    data: eventLogList
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
    function getLogPolicyInfo(logWarningBackend, $stateParams) {
        return logWarningBackend.getLogPolicy($stateParams.log_id);
    }

    /* @ngInject */
    function warningEvent(appWarningBackend, utils, $stateParams) {
        return appWarningBackend.warningEvent(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function scaleList(appScalingBackend, utils, $stateParams) {
        return appScalingBackend.scaleList(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function logList(logWarningBackend, utils, $stateParams) {
        return logWarningBackend.logPolicyList(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function eventLogList(logWarningBackend, utils, $stateParams) {
        return logWarningBackend.logPolicyEvents(utils.encodeQueryParams($stateParams));
    }
})();
