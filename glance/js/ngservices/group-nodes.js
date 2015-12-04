(function () {
    'use strict';
    function groupNodes() {

        var getNodesCache = function(cluster) {
            var cache = {
                services: {},
                status: {},
                amounts: {}
            };

            var amounts = initNodesAmounts();
            
            var serviceStatus, nodeStatus;
            var nodes = cluster.nodes;
            var node;

            for(var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                serviceStatus = calNodeServiceStatus(node.role, node.services);
                nodeStatus = calNodeStatus(node.role, serviceStatus, node.status);
                cache.services[node.id] = node.services;
                cache.status[node.id] = nodeStatus;
                amounts[nodeStatus] += 1;
            }
            cache.amounts = amounts;
            return cache;
        }

        var updateNodesAmounts = function(clusters, clusterId, nodeId, services, status, cache) {
            var role = findUpdatedNodeRole(clusters, clusterId, nodeId);
            var oldServices, newServices, oldNodeStatus, newNodeStatus;

            var oldServiceStatus = calNodeServiceStatus(role, cache.services);
            var oldNodeStatus =  cache.nodeStatus;
            var amounts = cache.amounts;

            //服务有更新
            if (services) {
                var newServiceStatus = calNodeServiceStatus(role, services);

                if (oldServiceStatus !== newServiceStatus) {
                    newNodeStatus = calNodeStatus(role, newServiceStatus, oldNodeStatus);
                } else {
                    newNodeStatus = oldNodeStatus;
                }
            }

            //主机状态有更新
            if (status) {
                newNodeStatus = calNodeStatus(role, oldServiceStatus, status);
            }

            if (oldNodeStatus !== newNodeStatus) {
                amounts[oldNodeStatus] -= 1;
                amounts[newNodeStatus] += 1;
            }
            return {
                amounts: amounts,
                newNodeStatus: newNodeStatus,
                newServices: services
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
            if (status === NODE_STATUS.terminated) {
                return NODE_STATUS.terminated;
            } else if (status === NODE_STATUS.installing || serviceStatus === SERVICES_STATUS.installing) {
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

        return {
            getNodesCache: getNodesCache,
            updateNodesAmounts: updateNodesAmounts
        };
    }
    
    groupNodes.$inject = [];
    glanceApp.factory('groupNodes', groupNodes);

})();