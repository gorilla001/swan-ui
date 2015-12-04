(function () {
    'use strict';
    function groupNodes() {

        var getOriginalCluster = function(cluster) {
            var originalCluster = {
                services: {},
                nodeStatus: {},
                rawStatus: {},
                amounts: {}
            };
            originalCluster.amounts = initNodesAmounts();
            var serviceStatus, nodeStatus, node;

            for(var i = 0; i < cluster.nodes.length; i++) {
                node = cluster.nodes[i];
                serviceStatus = calNodeServiceStatus(node.role, node.services);
                nodeStatus = calNodeStatus(node.role, serviceStatus, node.status);
                originalCluster.services[node.id] = node.services;
                originalCluster.nodeStatus[node.id] = nodeStatus;
                originalCluster.rawStatus[node.id] = node.status;
                originalCluster.amounts[nodeStatus] += 1;
            }
            return originalCluster;
        };

        var updateClusterCache = function(clusters, wsData, clusterCache) {
            
            var clusterId = wsData.clusterId;
            var nodeId = wsData.nodeId;
            var status = wsData.status;

            var oldServices = clusterCache.servicesCache[nodeId];
            var newServices = oldServices;
            var oldNodeStatus = clusterCache.nodeStatusCache[nodeId];
            var newNodeStatus = oldNodeStatus;
            var rawStatus = clusterCache.rawStatusCache[nodeId];
            var amounts = clusterCache.amounts;

            var oldServiceStatus = calNodeServiceStatus(role, oldServices);

            var role = findUpdatedNodeRole(clusters, clusterId, nodeId);

            // 主机状态有更新
            if (status) {
                newNodeStatus = calNodeStatus(role, oldServiceStatus, status);
                rawStatus = status;
            } else { //服务状态有更新
                newServices = collectLatestServices(wsData, oldServices);
                var newServiceStatus = calNodeServiceStatus(role, newServices);
                if (newServiceStatus !== oldServiceStatus) {
                    newNodeStatus = calNodeStatus(role, newServiceStatus, rawStatus);
                }
            }
            if (oldNodeStatus !== newNodeStatus) {
                amounts[oldNodeStatus] -= 1;
                amounts[newNodeStatus] += 1;
            }

            return {
                newAmounts: amounts,
                newNodeStatus: newNodeStatus,
                newServices: newServices,
                newRawStatus: rawStatus
            };
        };

        function initNodesAmounts() {
            var amounts = {};
            var allNodeStatuses = Object.keys(NODE_STATUS);
            for (var i = 0; i < allNodeStatuses.length; i++) {
                amounts[allNodeStatuses[i]] = 0;
            }
            return amounts;
        }

        function findUpdatedNodeRole (clusters, clusterId, nodeId) {
            for (var i = 0; i < clusters.length; i++) {
                if (clusterId === clusters[i].id) {
                    for (var j = 0; j < clusters[i].nodes.length; j++) {
                        if(nodeId === clusters[i].nodes[j].id) {
                            return clusters[i].nodes[j].role;
                        }
                    }
                } 
            }
        }

        function calNodeStatus(role, serviceStatus, status) {
            var isMaster = calIsMaster(role);

            var isInstalling = Boolean(
                (status === NODE_STATUS.installing) || 
                (serviceStatus === SERVICES_STATUS.installing) || 
                (status === NODE_STATUS.initing) || 
                (status === NODE_STATUS.upgrading)
            );
            
            if (status === NODE_STATUS.terminated) {
                return NODE_STATUS.terminated;
            } else if (isInstalling) {
                return NODE_STATUS.installing;
            } else if (serviceStatus === SERVICES_STATUS.failed) {
                return NODE_STATUS.failed;
            } else {
                return NODE_STATUS.running;
            }
        }
    
        function calNodeServiceStatus(role, services) {
            var nodeServiceStatus = SERVICES_STATUS.running;
            var statuses = [SERVICES_STATUS.failed, SERVICES_STATUS.uninstalled];
            var isMaster = calIsMaster(role);
            var service;
            for (var i = 0; i < services.length; i++) {
                service = services[i];
                if (service.status === SERVICES_STATUS.installing) {
                    return SERVICES_STATUS.installing;
                }
                nodeServiceStatus = isNodeServicesFailedOrUninstalled(service, isMaster, statuses);
                if (nodeServiceStatus) {
                    return nodeServiceStatus;
                }
            }
            return nodeServiceStatus;
        }

        function isNodeServicesFailedOrUninstalled(service, isMaster, statuses) {
            if (statuses.indexOf(service.status) > -1) {
                var serviceNames = {
                    master: ['zookeeper', 'master', 'marathon'],
                    slave: ['slave']
                };
                var masterCondition = Boolean(isMaster && (serviceNames.master.indexOf(service.name) > -1));
                var slaveCondition = Boolean(!isMaster && (serviceNames.slave.indexOf(service.name) > -1));
                if (masterCondition || slaveCondition) {
                    return service.status;
                }
            }
        }

        function calIsMaster(role) {
            return role === 'master';
        }

        function collectLatestServices(wsData, cacheServices) {
            var latestServices = angular.copy(cacheServices);
            var key;
            for (key in wsData) {
                if ((key !== 'clusterId') && (key !== 'nodeId')) {
                    latestServices[key] = wsData[key];
                }
            }
            return latestServices;
        }

        return {
            getOriginalCluster: getOriginalCluster,
            updateClusterCache: updateClusterCache
        };
    }
    
    groupNodes.$inject = [];
    glanceApp.factory('groupNodes', groupNodes);

})();