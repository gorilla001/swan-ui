var glanceApp = angular.module('glance',
    [
        'ngCookies',
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ngSocket',
        'infinite-scroll',
        'ngSanitize',
        'isteven-multi-select',
        'ui.bootstrap.datetimepicker',
        'ui-notification',
        'rzModule',
        'ngTable',
        'glance.utils',
        'glance.app',
        'glance.user',
        'glance.image',
        'glance.common',
        'glance.repository',
        'glance.policy',
        'ngMaterial',
        'glance.layout'
    ]);

glanceApp.config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider','NotificationProvider',
    function ($stateProvider, $urlRouterProvider, $interpolateProvider, $locationProvider, NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 1000,
            positionX: 'right',
            positionY: 'top',
            replaceMessage: true,
            startTop: 20,
            startRight: 260
        });

        $urlRouterProvider.otherwise('/home');
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
            .state('cluster.nodesource', {
                url: '/:clusterId/nodesource',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/node-source.html',
                        controller: 'addNodeCtrl'
                    }
                },
                resolve: {
                    nodeInfo:  ['gHttp', '$stateParams', function(gHttp, $stateParams){
                            return gHttp.Resource("cluster.nodeId", {cluster_id: $stateParams.clusterId}).get()
                        }]
                }
            })
            .state('cluster.iaas', {
                url: '/:clusterId/iaasprovider',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/iaas-buy.html',
                        controller: 'iaasCtrl'
                    }
                }
            })
            .state('cluster.addlivingnode', {
                url: '/:clusterId/addlivingnode/:nodeId',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/add-living-node.html',
                        controller: 'addLivingNodeCtrl'
                    }
                }
            })
            .state('cluster.nodedetails', {
                url: '/:clusterId/node/:nodeId',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/node-details.html',
                        controller: 'nodeDetailsCtrl'
                    }
                }
            })
            .state('cluster.updatenode', {
                url: '/:clusterId/node/:nodeId/update?name',
                views: {
                    'first': {
                        templateUrl: '/views/cluster/update-node.html',
                        controller: 'updateNodeCtrl'
                    }
                }
            })
            .state('cluster.clusterdetails', {
                url: '/:clusterId',
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
            .state('log', {
                url: '/log',
                views: {
                    '': {
                        templateUrl: '/views/log/log.html',
                        controller: 'logBaseCtrl'
                    }
                }
            })
            .state('home', {
                url: '/home',
                views: {
                    '': {
                        templateUrl: '/views/dynamic/dynamic.html',
                        controller: 'dynamicBaseCtrl'
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
            })
            .state('404', {
                views: {
                    '': {
                        templateUrl: '/views/common/notFound.html'
                    }
                }
            });


        $locationProvider.html5Mode(true);

        $interpolateProvider.startSymbol('{/');
        $interpolateProvider.endSymbol('/}');

        NotificationProvider.setOptions({
            replaceMessage: false 
        });
    }]);

glanceApp.run(glanceInit);

glanceInit.$inject = ['glanceUser', 'glanceHttp', '$rootScope', 'gHttp'];
function glanceInit(glanceUser, glanceHttp, $rootScope, gHttp) {
    glanceUser.init();
    gHttp.Resource("auth.user").get().then(function (data) {
        $rootScope.userName = data["userName"];
        $rootScope.userId = data["userId"];
        $rootScope.isSuperuser = data["isSuperuser"];
        $rootScope.isDemo = data["isDemo"];
        $rootScope.isFirstLogin = data["isFirstLogin"];
        $rootScope.phoneNumber = data["phoneNumber"];
        // join demo group flow
        $rootScope.isPhoneVerified = data["isPhoneVerified"];
        // demo group button
        $rootScope.notInDemoGroup = !data["isInDemoGroup"];
        $rootScope.demoGroupId = data["demoGroupId"];
        //GrowingIO
        if (RUNNING_ENV === "prod") {
            (function () {
                _vds.push(['setAccountId', '0edf12ee248505950b0a77b02d47c537']);
                _vds.push(['setCS1', 'user_id', data["userId"].toString()]);
                (function () {
                    var vds = document.createElement('script');
                    vds.type = 'text/javascript';
                    vds.async = true;
                    vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(vds, s);
                })();
            })();
        }
    })
}
