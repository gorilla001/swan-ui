(function () {
    'use strict';
    angular.module('glance.cluster')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider) {

        $stateProvider
            .state('cluster', {
                url: '/cluster',
                controller: 'clusterCtrl',
                template: '<ui-view/>',
                targetState: "list"
            })
            .state('cluster.detail', {
                url: '/detail/:clusterId',
                templateUrl: '/glance/cluster/detail/detail.html',
                controller: 'ClusterDetailCtrl as clusterDetailCtrl',
                targetState: 'nodes',
                resolve: {
                    clusterDetail: getCluster
                }
            })
            .state('cluster.detail.nodes', {
                url: '/nodes?per_page&page&order&keywords&sort_by',
                templateUrl: '/glance/cluster/detail/nodes.html',
                controller: 'ClusterNodesCtrl as clusterNodesCtrl',
                defaultParams: {
                    per_page: 20,
                    page: 1
                },
                resolve: {
                    nodes: listNodes
                }
            })
            .state('cluster.detail.monitor', {
                url: '/monitor',
                templateUrl: '/views/cluster/cluster-monitoring.html',
                controller: 'clusterMonitorCtrl'
            })
            .state('cluster.list', {
                url: '/list',
                templateUrl: '/views/cluster/list-clusters.html',
                controller: 'listClustersCtrl'
            })
            .state('cluster.createcluster', {
                url: '/createcluster',
                templateUrl: '/views/cluster/create-cluster.html',
                controller: 'createClusterCtrl'
            })
            .state('cluster.updatecluster', {
                url: '/:clusterId/update?name',
                templateUrl: '/glance/cluster/update/update-cluster.html',
                controller: 'UpdateClusterCtrl as updateClusterCtrl',
                resolve: {
                    clusterDetail: getCluster
                }
            })
            .state('cluster.nodesource', {
                url: '/:clusterId/nodesource',
                templateUrl: '/views/cluster/node-source.html',
                controller: 'addNodeCtrl',
                resolve: {
                    nodeInfo: ['gHttp', '$stateParams', function (gHttp, $stateParams) {
                        return gHttp.Resource("cluster.nodeId", {cluster_id: $stateParams.clusterId}).get()
                    }]
                }
            })
            .state('cluster.iaas', {
                url: '/:clusterId/iaasprovider',
                templateUrl: '/views/cluster/iaas-buy.html',
                controller: 'iaasCtrl'
            })
            .state('cluster.addlivingnode', {
                url: '/:clusterId/addlivingnode/:nodeId',
                templateUrl: '/views/cluster/add-living-node.html',
                controller: 'addLivingNodeCtrl'
            })
            .state('cluster.nodedetails', {
                url: '/:clusterId/node/:nodeId',
                templateUrl: '/glance/cluster/nodedetail/node-details.html',
                controller: 'NodeDetailsCtrl as nodeDetailsCtrl'
            })
            .state('cluster.updatenode', {
                url: '/:clusterId/node/:nodeId/update?name',
                templateUrl: '/views/cluster/update-node.html',
                controller: 'updateNodeCtrl'
            })
    }

    /* @ngInject */
    function getCluster($stateParams, clusterBackend) {
        return clusterBackend.getCluster($stateParams.clusterId);
    }

    /* @ngInject */
    function listNodes($stateParams, clusterBackend, utils) {
        return clusterBackend.listNodes($stateParams.clusterId, utils.encodeQueryParams($stateParams));
    }
})();