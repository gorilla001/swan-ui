var glanceApp = angular.module('glance', ['ngCookies', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngSocket','infinite-scroll','ngSanitize','isteven-multi-select', 'ui.bootstrap.datetimepicker', 'ui.bootstrap-slider', 'ui-notification', 'ngDialog']);

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
            .state('app.appdetail.version', {
                url: '/version',
                views: {
                    'tabdetail': {
                        templateUrl: '/views/app/appversion.html',
                        controller: 'appVersionCtrl'
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
