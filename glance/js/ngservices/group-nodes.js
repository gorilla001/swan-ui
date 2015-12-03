(function () {
    'use strict';
    function groupNodes() {

        var countNodesAmounts = function (nodes) {
            var amounts = {};
            amounts = initNodesAmounts();
            
            var nodeStatus;
            for(var i = 0; i < nodes.length; i++) {
                nodeStatus = calNodeStatus(nodes[i]);
                amounts[nodeStatus] += 1;
            }
            return amounts;
        };

        function initNodesAmounts() {
            var amounts = {};
            var allNodeStatuses = Object.keys(NODE_STATUS);
            for (var i = 0; i < allNodeStatuses.length; i++) {
                amounts[allNodeStatuses[i]] = 0;
            }
            return amounts;
        }

        function calNodeStatus(node) {
            var isMaster = calIsMaster(node);
            var servicesStatus = calNodeServiceStatus(node.services, isMaster);
            if (node.status === NODE_STATUS.terminated) {
                return NODE_STATUS.terminated;
            } else if (node.status === NODE_STATUS.installing || servicesStatus === SERVICES_STATUS.installing) {
                return NODE_STATUS.installing;
            } else if (servicesStatus === SERVICES_STATUS.failed) {
                return NODE_STATUS.failed;
            } else {
                return NODE_STATUS.running;
            }
        }

    
        function calNodeServiceStatus(services, isMaster) {
            var nodeServiceStatus = SERVICES_STATUS.running;
            var statuses = [SERVICES_STATUS.failed, SERVICES_STATUS.uninstalled];
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

        function calIsMaster(node) {
            return node.role === 'master';
        }
        
        return {
            countNodesAmounts: countNodesAmounts
        };
    }
    
    groupNodes.$inject = [];
    glanceApp.factory('groupNodes', groupNodes);

})();