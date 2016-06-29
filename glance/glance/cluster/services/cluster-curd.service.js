/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterCurd', clusterCurd);


    /* @ngInject */
    function clusterCurd(clusterBackend, confirmModal, $state, Notification, appservice, $mdDialog) {
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

        function deleteCluster(clusterId, ev, nodeTotal) {
            appservice.listClusterApps({}, clusterId).then(function(data) {
                var content;
                if (data.Count > 0) {
                    content = '集群中还有' + data.Count + '个应用而无法删除,请先删除应用';
                    var confirm = $mdDialog.confirm()
                        .clickOutsideToClose(true)
                        .title('无法删除集群')
                        .targetEvent(ev)
                        .ok('去看看应用')
                        .cancel('取消').textContent(content);
                    var dialog = $mdDialog.show(confirm);
                    dialog.then(function() {
                        $state.go('app');
                    });
                } else {
                    if(nodeTotal > 0) {
                        content = '集群中还有' + nodeTotal + '台主机，删除集群将同时清除这些主机上的数人云各组件。<br>'
                            + '此操作不可恢复，请慎重选择！'
                    }
                    confirmModal.open('您确定要删除集群吗？', ev, content)
                        .then(function () {
                            clusterBackend.deleteCluster(clusterId)
                                .then(function (data) {
                                    Notification.success('集群删除成功');
                                    $state.go('cluster.list', null, {reload: true});
                                });
                        })
                }
            });
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