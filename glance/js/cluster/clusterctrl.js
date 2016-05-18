//clusterCtrl.$inject = ['$scope', '$state', 'gHttp', 'Notification'];
glanceApp.controller('clusterCtrl', clusterCtrl);
/* ngInject */
function clusterCtrl($scope, $state, gHttp, Notification) {
    $scope.clusterNames = [];
    $scope.allLabels = [];

    $scope.statName = {
        running: '运行正常',
        terminated: '主机失联',
        failed: '主机异常',
        initing: '主机初始化中',
        upgrading: '主机升级中',
        abnormal: '主机预警',
        installing: '主机安装中',
        repairing: '主机修复中'
    };
    
    $scope.nodeStatusCls = {};
    $scope.nodeStatusCls[NODE_STATUS.running] = "fa fa-heartbeat text-success";
    $scope.nodeStatusCls[NODE_STATUS.terminated] = "fa fa-chain-broken text-danger";
    $scope.nodeStatusCls[NODE_STATUS.failed] = "fa fa-bomb text-danger";
    $scope.nodeStatusCls[NODE_STATUS.abnormal] = "fa fa-exclamation-triangle text-warning";
    $scope.nodeStatusCls[NODE_STATUS.installing] = "fa fa-cog text-normal";
    $scope.nodeStatusCls[NODE_STATUS.initing] = "fa fa-cog text-normal";
    $scope.nodeStatusCls[NODE_STATUS.upgrading] = "fa fa-cog text-normal";
    $scope.nodeStatusCls[NODE_STATUS.repairing] = "fa fa-cog text-normal";
    
    
    $scope.serviceStatusCls = {};
    $scope.serviceStatusCls[SERVICES_STATUS.running] = "fa fa-heartbeat text-success";
    $scope.serviceStatusCls[SERVICES_STATUS.failed] = "fa fa-bomb text-danger";
    $scope.serviceStatusCls[SERVICES_STATUS.uninstalled] = "fa fa-chain-broken text-warning";
    $scope.serviceStatusCls[SERVICES_STATUS.uninstalling] = "fa fa-cog text-normal";
    $scope.serviceStatusCls[SERVICES_STATUS.installing] = "fa fa-cog text-normal";
    $scope.serviceStatusCls[SERVICES_STATUS.pulling] = "fa fa-cog text-normal";
    
    $scope.getServiceLabel = function(serviceName) {
        var labels = {
            master: '主控组件',
            marathon: '应用调度组件',
            zookeeper: 'Zookeeper',
            exhibitor: 'ZK监控组件',
            slave: '节点组件',
            cadvisor: '监控组件',
            logcollection: '日志收集组件',
            bamboo: '服务发现监控组件',
            haproxy: '服务发现代理组件',
            chronos: '定时任务组件',
            docker: 'Docker'
        };
        if (labels[serviceName]) {
            return labels[serviceName];
        } else {
            return serviceName[0].toUpperCase() + serviceName.substring(1);
        }
    };

    $scope.deleteCluster = function(clusterId, name) {
        $('#confirmDeleteCluster'+ clusterId).hide();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        
        gHttp.Resource('cluster.cluster', {cluster_id: clusterId}).delete().then(function () {
            Notification.success('集群' + name + '删除成功');
            $state.go('cluster.listclusters', null, {reload: true});
        });
    };


    $scope.getClass = function(status) {
        var classes = {
            'running': 'text-success'
        };
        return classes[status] ? classes[status] : 'text-danger';
    };

    $scope.getIsMaster = function(node) {
        return node.role === 'master';
    };

    $scope.concatObjtoArr = function(obj) {
        var arr = [];
        $.each(obj, function(key, val) {
            arr = arr.concat(val);
        });
        return arr;
    };

    $scope.groupNodesByRoleAndStatus = function(nodes, clusterId, statusMgr) {
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
            statusMgr.addNode(clusterId, node);
            node.nodeStatus = statusMgr.nodes[node.id].status;
            $scope.getIsMaster(node)? cluster.masters[node.nodeStatus].push(node) : cluster.slaves[node.nodeStatus].push(node);
        });
        return cluster;
    };

    $scope.getClusterNames = function(clusters) {
        $scope.clusterNames = [];
        if (clusters && clusters.length) {
            $.each(clusters, function(index, cluster) {
                $scope.clusterNames.push(cluster.name);
            });
        }
    };

    $scope.getAllNodeLabelIds = function(labels, id) {
        return arrayValuesfromArray(labels, id);
    };

    $scope.getAllLabelNames = function(labels, name) {
        return arrayValuesfromArray(labels, name);
    };

    function arrayValuesfromArray(array, valueKey) {
        var allValues = [];
        for(var i = 0; i < array.length; i++) {
            allValues.push(array[i][valueKey]);
        }
        return allValues
    }
    
}

