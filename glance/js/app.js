var glanceApp = angular.module('glance', ['ngCookies', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngSocket','infinite-scroll','ngSanitize','isteven-multi-select', 'ui.bootstrap.datetimepicker', 'ui.bootstrap-slider', 'ui-notification']);

glanceApp.config(['$stateProvider',  '$urlRouterProvider','$interpolateProvider','$locationProvider',
    function($stateProvider, $urlRouterProvider, $interpolateProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/cluster/listclusters');
        $stateProvider
            .state("cluster", {
                url: '/cluster',
                abstract: true,
                views: {
                    "": {
                        templateUrl: '/views/cluster/cluster.html',
                        controller: 'clusterCtrl'
                    }
                }
            })
            .state('cluster.listclusters', {
                url: '/listclusters',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/list-clusters.html',
                        controller: 'listClustersCtrl'
                    }
                }
            })
            .state('cluster.createcluster', {
                url: '/createcluster',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/create-cluster.html',
                        controller: 'createClusterCtrl'
                    }
                }
            })
            .state('cluster.updatecluster', {
                url: '/:clusterId/update?name',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/update-cluster.html',
                        controller: 'updateClusterCtrl'
                    }
                }
            })
            .state('cluster.addnode', {
                url: '/:clusterId/addnode',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/add-node.html',
                        controller: 'addNodeCtrl'
                    }
                }
            })
            .state('cluster.nodedetails', {
                url: '/node/:nodeId',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/node-details.html',
                        controller: 'nodeDetailsCtrl'
                    }
                }
            })
            .state('cluster.updatenode', {
                url: '/node/:nodeId/update?name',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/update-node.html',
                        controller: 'updateNodeCtrl'
                    }
                }
            })
            .state('cluster.clusterdetails', {
                url:'/:clusterId',
                abstract: true,
                views: {
                    'first': {
                        templateUrl: '/views/cluster/cluster-details.html',
                        controller: 'clusterDetailsCtrl'
                    }
                }
            })
            .state('cluster.clusterdetails.nodes', {
                url: '/nodes',
                views: {
                    'cluster': {
                        templateUrl: '/views/cluster/cluster-nodes.html',
                        controller: 'clusterNodesCtrl'
                    }
                }
            })
            .state('cluster.clusterdetails.logs', {
                url: '/logs',
                views: {
                    'cluster': {
                        templateUrl: '/views/cluster/cluster-logs.html',
                        controller: 'clusterLogsCtrl'
                    }
                }
            })
            .state('cluster.clusterdetails.monitoring', {
                url: '/monitoring',
                views: {
                    'cluster': {
                        templateUrl: '/views/cluster/cluster-monitoring.html',
                        controller: 'clusterMonitorCtrl'
                    }
                }
            })
            .state('app', {
                url: '/app',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/views/app/applicationbase.html',
                        controller: 'appBaseCtrl'
                    }
                }
            })
            .state('app.applist', {
                url: '/applist',
                views: {
                    'first': {
                        templateUrl: '/views/app/applist.html',
                        controller: 'appListCtrl'
                    }
                }
            })
            .state('app.createapp', {
                url: '/createapp',
                views: {
                    'first': {
                        templateUrl: '/views/app/createapp.html',
                        controller: 'createappCtrlNew'
                    }
                }
            })
            .state('app.appdetail', {
                url: '/:appId',
                abstract: true,
                views: {
                    'first': {
                        templateUrl: '/views/app/appdetail.html',
                        controller: 'appdetailCtrl'
                    }
                }
            })
            .state('app.appdetail.instance', {
                url: '/instance',
                views: {
                    'tabdetail': {
                        templateUrl: '/views/app/appinstance.html',
                        controller: 'appInstanceCtrl'
                    }
                }
            })
            .state('app.appdetail.monitoring', {
                url: '/monitoring',
                views: {
                    'tabdetail': {
                        templateUrl: '/views/app/appmonitoring.html',
                        controller: 'appMonitorCtrl'
                    }
                }
            })
            .state('app.appdetail.config', {
                url: '/config',
                views: {
                    'tabdetail': {
                        templateUrl: '/views/app/appconfig.html',
                        controller: 'appConfigCtrl'
                    }
                }
            })
            .state('app.appdetail.event', {
                url: '/event',
                views: {
                    'tabdetail': {
                        templateUrl: '/views/app/appevent.html',
                        controller: 'appEventCtrl'
                    }
                }
            })
            .state('app.update', {
                url: '/update/:appId?clustername&appname&clusterId',
                views: {
                    'first': {
                        templateUrl: '/views/app/updateapp.html',
                        controller: 'updateAppCtrl'
                    }
                }
            })
            .state('log', {
                url: '/log',
                views: {
                    '': {
                        templateUrl: '/views/log/log.html',
                        controller: 'logBaseCtrl'
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                views: {
                    '': {
                        templateUrl: '/views/admin/admin.html',
                        controller: 'adminCtrl'
                    }
                }
            })
            .state('modifyPassword', {
                url: '/modifypassword',
                views: {
                    '': {
                        templateUrl: '/views/admin/modify-password.html',
                        controller: 'modifyPasswordCtrl'
                    }
                }
            });

        $locationProvider.html5Mode(true);

        $interpolateProvider.startSymbol('{/');
        $interpolateProvider.endSymbol('/}');
}]);

glanceApp.directive('ckbBatchAll', function(){
    return {
        restrict: 'A',
        scope: {
            prop: "=ckbBatchAll"
        },
        link: function (scope, elm) {
            if (!scope.prop) {
                scope.prop = {value: [], caTrigger:false, isAllChecked:false, total: 0}
            }
            elm.change(function () {
                scope.prop.isAllChecked = elm.prop("checked");
                scope.prop.caTrigger = !scope.prop.caTrigger;
                scope.$apply();
            });
            scope.$watchCollection("prop.value", function (nv, ov) {
                if (nv != ov) {
                    if (nv.length > 0 && nv.length == scope.prop.total) {
                        elm.prop("checked", true);
                        scope.prop.isAllChecked = true;
                    } else {
                        elm.prop("checked", false);
                        scope.prop.isAllChecked = false;
                    }
                }
            })
        }
    }
});

glanceApp.directive('ckbBatch', function(){
    return {
        restrict: 'A',
        scope: {
            prop: "=ckbBatch"
        },
        link: function (scope, elm, attrs) {
            if (!scope.prop) {
                scope.prop = {value: [], caTrigger: false, isAllChecked:false, total: 0};
            }
            scope.prop.total += 1;
            function onChange() {
                var idx = scope.prop.value.indexOf(attrs.value);
                if (elm.prop("checked") && idx < 0) {
                    scope.prop.value.push(attrs.value);
                } else if (!elm.prop("checked") && idx > -1){
                    scope.prop.value.splice(idx, 1);
                }
            }
            elm.change(function(){
                onChange();
                scope.$apply();
            });
            scope.$watch("prop.caTrigger", function (nv, ov) {
                if (nv != ov) {
                    if (scope.prop.isAllChecked) {
                        elm.prop("checked", true);
                    } else {
                        elm.prop("checked", false);
                    }
                    onChange();
                }
            });
            elm.on("$destroy", function () {
                scope.prop.total -= 1;
                var idx = scope.prop.value.indexOf(attrs.value);
                if (idx > -1) {
                    scope.prop.value.splice(idx, 1);
                    scope.$apply();
                }
            })
        }
    }
});

glanceApp.directive('dateFormat', ['$filter',function($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function formatter(value) {
                return dateFilter(value, 'yyyy-MM-dd HH:mm');
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);

        }
    };
}]);

glanceApp.directive('regexValidate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, ele, attrs, ctrl) {
            var regex = /([A-z\d\?\,\.\:\;\'\"\!\(\)])*[A-Z]/i;
            function valueLength(value) {
                var length = value.length;
                if (length > 0 && (length < 8 || length > 22)) {
                    return false;
                } else {
                    return true;
                }
            };
            
            ctrl.$parsers.unshift(function(value) {
                var valid = true;
                if (value) {
                    var len = valueLength(value);
                    var reg = regex.test(value);
                    valid = Boolean(reg && len);
                }
                ctrl.$setValidity('regexValidate', valid);
                return valid ? value : undefined;
            });

            ctrl.$formatters.unshift(function(value) {
                var valid = true;
                if (value) {
                    var reg = regex.test(value);
                    var len = valueLength(value);
                    valid = Boolean(reg && len);
                }

                ctrl.$setValidity('regexValidate', valid);
                return value;
            });
        }
    };
});

glanceApp.directive('valueMatch', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var firstValue = attrs.valueMatch;
            elem.add(firstValue).on('keyup', function() {
                scope.$apply(function() {
                    var valid = true;
                    if (elem.val()) {
                        valid = Boolean((elem.val() === $(firstValue).val()));
                    }
                    ctrl.$setValidity('valueMatch', valid);
                    return valid ? elem.val() : undefined;
                });
            });
        }
    };
});