/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterCurd', clusterCurd);


    /* @ngInject */
    function clusterCurd(clusterBackend, confirmModal, $state) {
        return {
            listClusterLables: listClusterLables,
            deleteCluster: deleteCluster,
            deletNodes: deletNodes
        };

        function listClusterLables() {
            return clusterBackend.listClusters()
                .then(function (data) {
                    var clusters = [];

                    angular.forEach(data, function (cluster, index) {
                        if (cluster.group_name) {
                            clusters.push({id: cluster.id, name: cluster.group_name + ":" + cluster.name});
                        } else {
                            clusters.push({id: cluster.id, name: cluster.name});
                        }
                    });

                    return clusters
                });
        }

        function deleteCluster(clusterId, ev) {
            var content = '删除集群将在您的主机上一并清除：数人云管理组件，通过数人云下发部署的应用及其未持久化的数据';
            confirmModal.open('您确定要删除集群吗？', ev, content)
                .then(function () {
                    clusterBackend.deleteCluster(clusterId)
                        .then(function (data) {
                            Notification.success('集群删除成功');
                            $state.go('cluster.list', null, {reload: true});
                        });
                })

        }

        function deletNodes(clusterId, selectNodes, ev) {
            var toast = "您确定要移除主机吗？";
            var nodeIds = [];

            for (var i = 0; i < selectNodes.length; i++) {
                nodeIds.push(selectNodes[i].id);
                if (selectNodes[i].role == 'master') {
                    toast = "您所删除的主机中包含 Master,删除后会引起故障，是否继续删除？";
                }
            }

            confirmModal.open(toast, ev)
                .then(function () {
                    clusterBackend.deleteNodes(clusterId, nodeIds)
                        .then(function (data) {
                            $state.reload()
                        })
                });

        }

    }
})();