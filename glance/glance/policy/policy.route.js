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
                url: '/warninglist?per_page&page&order&keywords&sort_by&alias',
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
                url: '/warningevent',
                views: {
                    'warningContent': {
                        templateUrl: '/glance/policy/appwarning/event/event.html',
                        controller: 'WarningEventCtrl as warningEventCtrl'
                    }
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
                        templateUrl: '/glance/policy/apptimescaling/list/scalingList.html'
                    }
                }
            })
            .state('policy.apptimescaling.scalingevent', {
                url: '/scalingevent',
                views: {
                    'scalingContent': {
                        templateUrl: '/glance/policy/apptimescaling/event/scalingEvent.html'
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
})();
