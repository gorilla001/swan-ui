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
        transient: '计算节点',
        gateway: '外部网关',
        proxy: '内部代理',
        persistent: '数据节点'
    };

    $scope.serviceState = {};
    
    $scope.deleteCluster = function(clusterId, name) {
        $('#confirmDeleteCluster'+ clusterId).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        glanceHttp.ajaxGet(['cluster.delCluster', {cluster_id: clusterId}], function () {
            Notification.success('集群' + name + '删除成功');
            $state.go('cluster.listclusters', null, {reload: true});
        });
    };

    $scope.upgradeAgent = function (clusterId) {
        glanceHttp.ajaxPost(['cluster.updateCluster'], {'id': clusterId, 'isUpdateAgent': true}, function() {
            Notification.success('设置升级集群 Agent 成功')
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

    function getNodeServiceStatus(services, isMaster) {
        var nodeServiceStatus = SERVICES_STATUS.running;
        var statuses = [SERVICES_STATUS.failed, SERVICES_STATUS.uninstalled];
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

    $scope.getNodeStatus = function(node) {
        var isMaster = $scope.getIsMaster(node);
        var servicesStatus = getNodeServiceStatus(node.services, isMaster);
        if (node.status === NODE_STATUS.terminated) {
            return NODE_STATUS.terminated;
        } else if (node.status === NODE_STATUS.installing || servicesStatus === SERVICES_STATUS.installing) {
            return NODE_STATUS.installing;
        } else if (servicesStatus === SERVICES_STATUS.failed) {
            return NODE_STATUS.failed;
        } else {
            return NODE_STATUS.running;
        }
    };

    $scope.getSeriveState = function (nodeServices) {
        for (var i = 0; i < nodeServices.length; i++) {
            if (nodeServices[i].name === 'marathon') {
                $scope.serviceState.marathon = nodeServices[i].status;
            } else if (nodeServices[i].name === 'master') {
                $scope.serviceState.mesos = nodeServices[i].status;
            } else if (nodeServices[i].name === 'zookeeper') {
                $scope.serviceState.zookeeper = nodeServices[i].status;
            } else if (nodeServices[i].name === 'slave') {
                $scope.serviceState.slave = nodeServices[i].status;
            }
        }
    };

    $scope.concatObjtoArr = function(obj) {
        var arr = [];
        $.each(obj, function(key, val) {
            arr = arr.concat(val);
        });
        return arr;
    }

    function groupMasters(nodes) {
        var cluster = {
            masters: [],
            nonMasters: []
        };
        if (nodes && nodes.length) {
            var isMaster;
            $.each(nodes, function(index, node) {
                isMaster = $scope.getIsMaster(node);
                if (isMaster) {
                    cluster.masters.push(node);
                }else{
                    cluster.nonMasters.push(node);
                }
            });
        }
        return cluster;
    }

    function classifyNodesByState(nodes) {
        var groups = {}
        var showState;
        var showStates = Object.keys(NODE_STATUS);
        $.each(showStates, function(index, key) {
            groups[key] = [];
        });
        if(nodes && nodes.length) {
            $.each(nodes, function(nodeIndex, node) {
                showState = $scope.getNodeStatus(node);
                node.showState = showState;
                groups[showState].push(node);
            });
        }
        return groups;
    }

    $scope.groupMasterWithState = function(nodes) {
        var groupsWithState = {};
        var cluster = groupMasters(nodes);
        $.each(cluster, function(key, val) {
            groupsWithState[key] = classifyNodesByState(val);
        });
        return groupsWithState;
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