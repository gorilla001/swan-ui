function clusterCtrl($scope, $state, $rootScope, glanceHttp, Notification) {
    $rootScope.show = 'cluster';

    $scope.clusterNames = [];

    $scope.statName = {
        running: '运行正常',
        terminated: '主机失联',
        failed: '主机预警',
        installing: '主机初始化中'
    };

    $scope.nodeAttributes = {
        gateway: '外部网关',
        proxy: '内部代理',
    };

    $scope.deleteCluster = function(clusterId, name) {
        $('#confirmDeleteCluster'+ clusterId).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        glanceHttp.ajaxDelete(['cluster.clusterIns', {cluster_id: clusterId}], function () {
            Notification.success('集群' + name + '删除成功');
            $state.go('cluster.listclusters', null, {reload: true});
        });
    };


    $scope.getClass = function(status) {
        var classes = {
            'running': 'text-success',
            'terminated': 'text-danger',
            'failed': 'text-danger',
            'installing': 'text-danger'
        };
        return classes[status];
    };

    $scope.getIsMaster = function(node) {
        return node.role === 'master';
    };

    function getNodeServiceStatus(clusterId, nodeId, statusCache) {
        var checkServices;
        if (statusCache[clusterId]["masters"][nodeId]) {
            checkServices = ['zookeeper', 'master', 'marathon'];
        } else {
            checkServices = ["slave"]
        }
        for (var serviceName in statusCache[clusterId]["nodes"][nodeId]["services"]) {
            var serviceStatus = statusCache[clusterId]["nodes"][nodeId]["services"][serviceName]
            if (serviceStatus == SERVICES_STATUS.installing) {
                return SERVICES_STATUS.installing;
            } else if (serviceStatus == SERVICES_STATUS.failed || serviceStatus == SERVICES_STATUS.uninstalled){
                if (checkServices.indexOf(serviceName) > -1) {
                    return serviceStatus;
                }
            }
        }
        return SERVICES_STATUS.running;
    }

    $scope.updateServiceStatus = function (clusterId, nodeId, serviceName, status, statusCache) {
        if (statusCache[clusterId] && statusCache[clusterId]["nodes"][nodeId]) {
            if (status == "uninstalling"){
                status = SERVICES_STATUS.installing;
            }
            statusCache[clusterId]["nodes"][nodeId]["services"][serviceName] = status;
        }
    }

    $scope.updateNodeStatus = function (clusterId, nodeId, rawStatus, agentVersion, statusCache) {
        if (statusCache[clusterId] && statusCache[clusterId]["nodes"][nodeId]) {
            var servicesStatus = getNodeServiceStatus(clusterId, nodeId, statusCache);
            var status;
            if (!rawStatus) {
                rawStatus = statusCache[clusterId]["nodes"][nodeId].status;
            }
            if (rawStatus === NODE_STATUS.terminated) {
                status = NODE_STATUS.terminated;
            } else if (rawStatus === NODE_STATUS.installing || rawStatus === NODE_STATUS.initing
                    || rawStatus === NODE_STATUS.upgrading || servicesStatus === SERVICES_STATUS.installing) {
                status = NODE_STATUS.installing;
            } else if (servicesStatus === SERVICES_STATUS.failed) {
                status = NODE_STATUS.failed;
            } else {
                status = NODE_STATUS.running;
            }
            statusCache[clusterId]["nodes"][nodeId].status = status;
            if (agentVersion){
                statusCache[clusterId]["nodes"][nodeId].agentVersion = agentVersion;
            }
        }
    }
    
    $scope.countOldAgent = function(nodes) {
        var num = 0;
        angular.forEach(nodes, function(node) {
            if (node.agentVersion != $rootScope.agentVersion) {
                num += 1;
            }
        })
        return num;
    }

    $scope.addNode2StatusStore = function (clusterId, node, statusCache) {
        if (!statusCache[clusterId]) {
            statusCache[clusterId] = {"masters": {}, "nodes": {}};
        }
        if (node.role == "master") {
            statusCache[clusterId]["masters"][node.id] = true;
        }
        statusCache[clusterId]["nodes"][node.id] = {"services": {}};
        angular.forEach(node.services, function (service) {
            $scope.updateServiceStatus(clusterId, node.id, service.name, service.status, statusCache)
        });
        $scope.updateNodeStatus(clusterId, node.id, node.status, node.agent_version, statusCache);
    }

    $scope.startListenStatusUpdate = function (scope, statusCache) {
        scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
            $scope.updateNodeStatus(data.clusterId, data.nodeId, data.status, data.agentVersion, statusCache);
        });
        scope.$on(SUB_INFOTYPE.serviceStatus, function (event, data) {
            angular.forEach(data, function (val, key){
                if (key != "clusterId" && key != "nodeId") {
                    $scope.updateServiceStatus(data.clusterId, data.nodeId, key, val, statusCache)
                }
            });
            $scope.updateNodeStatus(data.clusterId, data.nodeId, undefined, undefined, statusCache);
        });
    }

    $scope.concatObjtoArr = function(obj) {
        var arr = [];
        $.each(obj, function(key, val) {
            arr = arr.concat(val);
        });
        return arr;
    }

    $scope.groupNodesByRoleAndStatus = function(nodes, clusterId, statusCache) {
        var cluster = {
            masters: {},
            slaves: {}
        };

        var nodeStatuses = Object.keys(NODE_STATUS);
        angular.forEach(cluster, function(nodes, role) {
            angular.forEach(nodeStatuses, function(status, index) {
                cluster[role][status] = [];
            });
        });

        angular.forEach(nodes, function(node, index) {
            $scope.addNode2StatusStore(clusterId, node, statusCache)
            node.nodeStatus = statusCache[clusterId]["nodes"][node.id].status;
            $scope.getIsMaster(node)? cluster.masters[node.nodeStatus].push(node) : cluster.slaves[node.nodeStatus].push(node);
        });
        return cluster;
    }

    $scope.getClusterNames = function(clusters) {
        $scope.clusterNames = [];
        if (clusters && clusters.length) {
            $.each(clusters, function(index, cluster) {
                $scope.clusterNames.push(cluster.name);
            });
        }
    }
}

clusterCtrl.$inject = ['$scope', '$state', '$rootScope', 'glanceHttp', 'Notification'];
glanceApp.controller('clusterCtrl', clusterCtrl);
