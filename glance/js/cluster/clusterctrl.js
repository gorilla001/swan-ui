function clusterCtrl($scope, $state, $rootScope, glanceHttp, Notification) {
    $rootScope.show = 'cluster';

    $scope.clusterNames = [];
    $scope.allLabels = [];

    $scope.statName = {
        running: '运行正常',
        terminated: '主机失联',
        failed: '主机预警',
        installing: '主机初始化中',
        upgrading: '主机升级中'
    };

    $scope.nodeAttributes = {
        gateway: '外部网关',
        proxy: '内部代理',
    };
    
    $scope.getServiceLabel = function(serviceName) {
        var labels = {
            master: '主控组件',
            marathon: '应用调度组件',
            zookeeper: 'Zookeeper',
            exhibitor: 'ZK监控组件',
            slave: '节点组件',
            cadvisor: '监控组件',
            logcollection: '日志收集组件',
            bamboo_gateway: '外部网关组件',
            bamboo_proxy: '内部代理组件',
            chronos: '定时任务组件',
            docker: 'Docker'
        };
        if (labels[serviceName]) {
            return labels[serviceName];
        } else {
            return serviceName[0].toUpperCase() + serviceName.substring(1);
        }
    }

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
    }

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
            statusMgr.addNode(clusterId, node)
            node.nodeStatus = statusMgr.nodes[node.id].status;
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

clusterCtrl.$inject = ['$scope', '$state', '$rootScope', 'glanceHttp', 'Notification'];
glanceApp.controller('clusterCtrl', clusterCtrl);
