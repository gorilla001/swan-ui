(function() {
    'use strict';
    
    angular.module('glance').factory('ClusterStatusMgr', clusterStatusMgr);
    
    function clusterStatusMgr() {
    
        function ClusterStatusMgr(latesetVersion) {
            this.clusters = {};
            this.nodes = {};
            this.nodeStatusCount = {};
            this.nodeOldVersionCount = {};
            this.latestVersion = latesetVersion;
        }
        
        ClusterStatusMgr.prototype._getNodeServiceStatus = function(clusterId,  nodeId) {
            var checkServices;
            if (this.clusters[clusterId].masters[nodeId]) {
                checkServices = ['zookeeper', 'master', 'marathon'];
            } else {
                checkServices = ['slave']
            }
            for (var serviceName in this.nodes[nodeId].services) {
                var serviceStatus = this.nodes[nodeId].services[serviceName].status;
                if (serviceStatus == SERVICES_STATUS.installing || serviceStatus == SERVICES_STATUS.pulling) {
                    return SERVICES_STATUS.installing;
                } else if (serviceStatus == SERVICES_STATUS.failed || serviceStatus == SERVICES_STATUS.uninstalled){
                    if (checkServices.indexOf(serviceName) > -1) {
                        return SERVICES_STATUS.failed;
                    }
                }
            }
            return SERVICES_STATUS.running;
        }
        
        ClusterStatusMgr.prototype.updateServiceStatus = function(nodeId, serviceName, service) {
            if (this.nodes[nodeId]) {
                if (service.status == 'uninstalling'){
                    service.status = SERVICES_STATUS.installing;
                }
                this.nodes[nodeId]['services'][serviceName] = {'status': service.status};
                if (service.version) {
                    this.nodes[nodeId]['services'][serviceName].version = service.version;
                }
            }
        }
        
        ClusterStatusMgr.prototype.updateNodeStatus = function(clusterId, nodeId, rawStatus, agentVersion) {
            if (this.nodes[nodeId]) {
                var servicesStatus = this._getNodeServiceStatus(clusterId, nodeId);
                var status;
                if (!rawStatus) {
                    rawStatus = this.nodes[nodeId].status;
                    if (rawStatus === NODE_STATUS.failed) {
                        rawStatus = NODE_STATUS.running;
                    }
                }
                if (rawStatus === NODE_STATUS.installing || rawStatus === NODE_STATUS.initing
                    || rawStatus === NODE_STATUS.uninstalling) {
                    status = NODE_STATUS.installing;
                } else if (rawStatus === NODE_STATUS.running){
                   if (this._getNodeServiceStatus(clusterId, nodeId) === SERVICES_STATUS.failed) {
                       status = NODE_STATUS.failed;
                   }
                }
                if (!status) {
                    status = rawStatus;
                }
                this.nodes[nodeId].status = status;
                if (agentVersion){
                    this.nodes[nodeId].services.agent.version = agentVersion;
                }
                this._refreshCounts(clusterId);
            }
            
        }
        
        ClusterStatusMgr.prototype._refreshCounts = function(clusterId) {
            this.nodeStatusCount[clusterId] = {};
            this.nodeOldVersionCount[clusterId] = {'total': 0, 'widgets': {}};
            angular.forEach(this.clusters[clusterId].nodes, function(_val, nodeId) {
                var node = this.nodes[nodeId];
                this._nodeStatusInc(clusterId, node);
                if (this.latestVersion) {
                    this._nodeOldVersionInc(clusterId, node);
                }
            }.bind(this));
        }
        
        ClusterStatusMgr.prototype._nodeStatusInc = function(clusterId, node) {
            if (!this.nodeStatusCount[clusterId][node.status]) {
                this.nodeStatusCount[clusterId][node.status] = 1;
            } else {
                this.nodeStatusCount[clusterId][node.status] += 1;
            }
        }
        
        ClusterStatusMgr.prototype._nodeOldVersionInc = function(clusterId, node) {
            var isOld = false;
            angular.forEach(this.latestVersion, function(version, widgetName) {
                if (node.services[widgetName] && node.services[widgetName].version && node.services[widgetName].version != version) {
                    isOld = true;
                    if (!this.nodeOldVersionCount[clusterId][widgetName]) {
                        this.nodeOldVersionCount[clusterId][widgetName] = 1;
                    } else {
                        this.nodeOldVersionCount[clusterId][widgetName] += 1;
                    }
                    this.nodeOldVersionCount[clusterId].widgets[widgetName] = true;
                }
            }.bind(this));
            if (isOld) {
                this.nodeOldVersionCount[clusterId].total += 1;
            }
        }
    
        ClusterStatusMgr.prototype.addNode = function(clusterId, node) {
            if (!this.clusters[clusterId]) {
                this.clusters[clusterId] = {'masters': {}, 'nodes': {}};
            }
            if (node.role == 'master') {
                this.clusters[clusterId].masters[node.id] = true;
            }
            this.clusters[clusterId].nodes[node.id] = true;
            this.nodes[node.id] = {'services': {'agent':{}}};
            angular.forEach(node.services, function (service) {
                this.updateServiceStatus(node.id, service.name, service);
            }.bind(this));
            this.updateNodeStatus(clusterId, node.id, node.status, node.agent_version);
        }
        
        ClusterStatusMgr.prototype.startListen = function(scope) {
            scope.$on(SUB_INFOTYPE.nodeStatus, function (event, data) {
                this.updateNodeStatus(data.clusterId, data.nodeId, data.status, data.agentVersion);
            }.bind(this));
            scope.$on(SUB_INFOTYPE.serviceStatus, function (event, data) {
                angular.forEach(data, function (val, key){
                    if (key != "clusterId" && key != "nodeId") {
                        this.updateServiceStatus(data.nodeId, key, val);
                    }
                }.bind(this));
                this.updateNodeStatus(data.clusterId, data.nodeId, undefined, undefined);
            }.bind(this));
        }
        
        return ClusterStatusMgr;
    }
})();
