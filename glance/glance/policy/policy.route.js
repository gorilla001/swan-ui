(function () {
    'use strict';
    angular.module('glance.policy')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {

        $stateProvider
            .state('policy', {
                url: '/policy',
                template: '<ui-view/>',
                targetState: 'tab'
            })
            .state('policy.tab', {
                url: '/policy',
                templateUrl: '/glance/policy/common/policy.html',
                targetState: 'appwarning'
            })
            .state('policy.WarningCreate', {
                url: '/appwarningcreate',
                templateUrl: '/glance/policy/appwarning/createupdate/create-update.html',
                controller: 'CreateWarningCtrl as createWarningCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    warning: function () {
                        return 'create'
                    }
                }
            })
            .state('policy.WarningUpdate', {
                url: '/appwarningupdate?task_id',
                templateUrl: '/glance/policy/appwarning/createupdate/create-update.html',
                controller: 'CreateWarningCtrl as createWarningCtrl',
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    warning: getTaskInfo
                }
            })
            .state('policy.tab.appwarning', {
                url: '/appwarning',
                views: {
                    'appWarningTab': {
                        templateUrl: '/glance/policy/appwarning/warning-tab-view.html'
                    }
                },
                targetState: 'warninglist'
            })
            .state('policy.tab.appwarning.warninglist', {
                url: '/warninglist?per_page&page&order&keywords&sort_by&appalias',
                views: {
                    'list': {
                        templateUrl: '/glance/policy/appwarning/list/list.html',
                        controller: 'WarningListCtrl as warningListCtrl'
                    }
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: warningList
                }
            })
            .state('policy.tab.appwarning.warningevent', {
                url: '/warningevent?per_page&page&order&keywords&sort_by',
                views: {
                    'event': {
                        templateUrl: '/glance/policy/appwarning/event/event.html',
                        controller: 'WarningEventCtrl as warningEventCtrl'
                    }
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: warningEvent
                }
            })
            .state('policy.tab.apptimescaling', {
                url: '/apptimescaling',
                views: {
                    'policyTab': {
                        templateUrl: '/glance/policy/apptimescaling/scaling-tab-view.html'
                    }
                }
            })
            .state('policy.tab.apptimescaling.scalinglist', {
                url: '/scalinglist?per_page&page&order&keywords&sort_by',
                views: {
                    'scalingContent': {
                        templateUrl: '/glance/policy/apptimescaling/list/list.html',
                        controller: 'ScalingListCtrl as scalingListCtrl'
                    }
                },
                defaultParams: {
                    per_page: 20,
                    page: 1
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
        //return appWarningBackend.warningList(utils.encodeQueryParams($stateParams));
        return {tasks: [{id:1, appname:"111", duration: 1,times:2, emails:"3@3.com",updated: "2016-05-09T14:33:48Z", enabled: true}],count:1}
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
        //return appWarningBackend.warningEvent(utils.encodeQueryParams($stateParams));
        return {events: [{taskid: 1,appname: '111', alerttime: '2016-05-09T14:33:48', instance: 1,metric: 'CpuUsedCores', currentvalue:0.8, operator: '>',threshold: 0.9}],count:1}
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
