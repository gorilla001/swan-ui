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
                url: '/tab',
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
                templateUrl: '/glance/policy/appwarning/warning-tab-view.html',
                targetState: 'warninglist'
            })
            .state('policy.tab.appwarning.warninglist', {
                url: '/warninglist?per_page&page&order&keywords&sort_by&appalias',
                templateUrl: '/glance/policy/appwarning/list/list.html',
                controller: 'WarningListCtrl as warningListCtrl',
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
                templateUrl: '/glance/policy/appwarning/event/event.html',
                controller: 'WarningEventCtrl as warningEventCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: warningEvent
                }
            })
            .state('policy.tab.appwarning.warningscaling', {
                url: '/warningscaling?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/policy/appwarning/scalingList/scalingList.html',
                controller: 'WarningScalingCtrl as warningScalingCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: warningAppExtend
                }
            })
            .state('policy.policyLogWarningCreate', {
                url: '/policyLogWarningCreate',
                templateUrl: '/glance/policy/applogwarning/createupdate/create-update.html',
                controller: 'CreateLogWarningCtrl as createLogWarningCtrl',
                resolve: {
                    target: function () {
                        return 'create'
                    },
                    logPolicy: function () {
                        return 'create'
                    }
                }
            })
            .state('policy.policyLogWarningUpdate', {
                url: '/policyLogWarningUpdate?log_id',
                templateUrl: '/glance/policy/applogwarning/createupdate/create-update.html',
                controller: 'CreateLogWarningCtrl as createLogWarningCtrl',
                resolve: {
                    target: function () {
                        return 'update'
                    },
                    logPolicy: getLogPolicyInfo
                }
            })
            .state('policy.tab.applogwarning', {
                url: '/applogwarning',
                templateUrl: '/glance/policy/applogwarning/log-tab-view.html',
                targetState: 'loglist'
            })
            .state('policy.tab.applogwarning.loglist', {
                url: '/loglist?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/policy/applogwarning/list/list.html',
                controller: 'LogWarningListCtrl as logWarningListCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: logList
                }
            })
            .state('policy.tab.applogwarning.logevent', {
                url: '/logevent?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/policy/applogwarning/event/event.html',
                controller: 'EventLogListCtrl as eventLogListCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: eventLogList
                }
            })
            .state('policy.tab.applogwarning.logscaling', {
                url: '/logscaling?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/policy/applogwarning/scalingList/scalingList.html',
                controller: 'WarnLogScalingCtrl as warnLogScalingCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    data: getScalingList
                }
            });

    }

    /* @ngInject */
    function warningList(appWarningBackend, utils, $stateParams) {
        return appWarningBackend.warningList(utils.encodeQueryParams($stateParams));
        //return {tasks: [{id:1, appname:"111", duration: 1,times:2,updated: "2016-05-09T14:33:48Z", enabled: true}],count:1}
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
        //return {events: [{taskid: 1,appname: '111', alerttime: '2016-05-09T14:33:48', instance: 1,metric: 'CpuUsedCores', currentvalue:0.8, operator: '>',threshold: 0.9}],count:1}
    }

    /* @ngInject */
    function warningAppExtend(appWarningBackend, utils, $stateParams) {
        return appWarningBackend.warningAppExtend(utils.encodeQueryParams($stateParams));
    }

    /* @ngInject */
    function logList(logWarningBackend, utils, $stateParams) {
        return logWarningBackend.logPolicyList(utils.encodeQueryParams($stateParams));
        //return {alarms: [{id:1, appname:'111',keyword: '1,23',ival: 60,gtnum:2,emails: '3@3.com',isnotice: false,createtime: '2016-05-09T14:33:48'}],count: 1}
    }

    /* @ngInject */
    function eventLogList(logWarningBackend, utils, $stateParams) {
        return logWarningBackend.logPolicyEvents(utils.encodeQueryParams($stateParams));
        //return {events: [{jobid: 1,appname: 'my',ival: 60,exectime: '2016-05-09T14:33:48',keyword:'abc',resultnum:3}],count: 1}
    }

    /* @ngInject */
    function getScalingList(logWarningBackend, utils, $stateParams) {
        //return {ScaleHistory: [{strategyId: 1,appName: 'my',instances: 6,created: '2016-05-09T14:33:48',status:1}],Count: 1};
        return logWarningBackend.warningLogExtend(utils.encodeQueryParams($stateParams));
    }
})();
