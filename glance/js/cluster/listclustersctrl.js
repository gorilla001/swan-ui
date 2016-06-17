/*@ngInject*/
function listClustersCtrl($scope, $state, Notification, ClusterStatusMgr, $timeout, gHttp, clusterProblemTipModal) {
    var clusterTypes = {
        '1_master': 1,
        '3_masters': 3,
        '5_masters': 5
    };

    var clusterLeastNodesNumber = {
        '1_master': 1,
        '3_masters': 4,
        '5_masters': 6
    };
    
    NODE_STATUS = {
            running: "running",
            terminated: "terminated",
            failed: "failed",
            installing: "installing",
            initing: "initing",
            upgrading: "upgrading",
            repairing: "repairing",
            abnormal: "abnormal"
        };

    var repairPromise;

    $scope.statusMgr = new ClusterStatusMgr();
    
    $scope.CLUSTER_STATUS = CLUSTER_STATUS;
    
    $scope.listCluster = function () {
        gHttp.Resource("cluster.clusters").get().then(function (data) {
            $scope.getClusterNames(data);
            $scope.clusters = data;
            $scope.clustersBasicData = getAllClustersBasicData();
            $scope.clustersNodesData = getAllClustersNodesData();
        });
    };
    $scope.listCluster();

    $scope.filterSingleCluster = function(index, clickedStatus) {
        var cluster = $scope.clusters[index];
        $scope.clustersNodesData[index] = getClusterNodesData(cluster, clickedStatus);
    };

    $scope.toggleShowMoreSlaves = function(index) {
        var basicInfos = $scope.clustersBasicData[index].infos;
        basicInfos.clickWords = basicInfos.showMore ? '点击显示更多' : '点击隐藏';
        basicInfos.showMore = !basicInfos.showMore;
    };
    
    $scope.showProblemTips = function (cluster, ev) {
        if (cluster.problemTips) {
            clusterProblemTipModal.open(cluster, ev).then(function () {
                if (cluster.infos.status === "new") {
                    $state.go('cluster.nodesource', {clusterId: cluster.infos.id});
                } else if (cluster.infos.status === "failed" || cluster.infos.status === "abnormal") {
                    if (cluster.needMasterIps.length > 0) {
                        $state.go('cluster.nodesource', {clusterId: cluster.infos.id});
                    } else {
                        gHttp.Resource('cluster.cluster', {'cluster_id': cluster.infos.id}).patch({"method": "repair"}).then(function(){
                            $state.go('cluster.detail.nodes', {clusterId: cluster.infos.id})
                        });
                    }
                }
            })
        }
    }

    function countNodesAmount(nodesWithRoleAndStatus) {
        var amounts = {
            total: 0
        };
        var nodeStatuses = Object.keys(NODE_STATUS);
        angular.forEach(nodeStatuses, function(nodeStatus, index) {
            amounts[nodeStatus] = 0;
            angular.forEach(nodesWithRoleAndStatus, function(nodesWithStatus, role) {
                amounts[nodeStatus] += nodesWithStatus[nodeStatus].length;
            });
            amounts.total += amounts[nodeStatus];
        });
        return amounts;
    }

    function getClusterBasicInfos(cluster) {
         var basicInfos = {};
         var keys = ['created_at', 'id', 'name', 'status', "updated_at", "group_name", "group_role"];
         if(cluster) {
            $.each(keys, function(index, key) {
                basicInfos[key] = cluster[key];
            });
         }
         basicInfos.showMore = '';
         basicInfos.clickWords = '点击显示更多';
         return basicInfos;
    }

    function buildHiddenStatuses(hiddenStatuses, clickedStatus) {
         var index;
         var filterStatus;
         if (clickedStatus === NODE_STATUS.installing) {
             filterStatus = [NODE_STATUS.installing, NODE_STATUS.initing, NODE_STATUS.upgrading, NODE_STATUS.repairing];
         } else {
             filterStatus = [clickedStatus];
         }
         angular.forEach(filterStatus, function(status) {
             if(hiddenStatuses.length) {
                 index = hiddenStatuses.indexOf(status);
                 (index === -1) ? hiddenStatuses.push(status): hiddenStatuses.splice(index, 1);
             } else {
                 var showStatuses = Object.keys(NODE_STATUS);
                 index = showStatuses.indexOf(status);
                 showStatuses.splice(index, 1);
                 hiddenStatuses = showStatuses;
             }
         })
         return hiddenStatuses;
    }

    function filterNodes(nodesWithRoleAndStatus, cluster, clickedStatus) {
        var allNodes = angular.copy(nodesWithRoleAndStatus, {});
        if (clickedStatus) {
            cluster.hiddenStatuses = buildHiddenStatuses(cluster.hiddenStatuses, clickedStatus);
            angular.forEach(allNodes, function(nodesWithRole, role) {
                angular.forEach(nodesWithRole, function(nodesWithStatus, nodeStatus) {
                    if (cluster.hiddenStatuses.indexOf(nodeStatus) > -1 ) {
                        allNodes[role][nodeStatus] = [];
                    }
                });
            });
        }
        return allNodes;
    }

    function getAllShowMasters(mastersWithStatus) {
        return $scope.concatObjtoArr(mastersWithStatus);
    }

    function getAllShowSlaves(slavesWithStatus) {
        var allShowSlaves = {
            first: [],
            following: []
        };
        var groupLength = 50;
        var slaves = $scope.concatObjtoArr(slavesWithStatus);
        var slavesLength = slaves.length;
        if (slavesLength) {
            allShowSlaves.first = slaves.slice(0, groupLength);
            var groupNumber = Math.ceil(slavesLength / groupLength);
            if (groupNumber > 1) {
                for (var i = 1; i < groupNumber; i++) {
                    allShowSlaves.following[i-1] = slaves.slice(i * groupLength, (i+1)*groupLength);
                }
            }
        }
        return allShowSlaves;
    }
    
    function getClusterBasicData(cluster) {
        var clusterBasicData = {
            infos: {},
            amounts: {},
            problemNodes: []
        };
        clusterBasicData.infos = getClusterBasicInfos(cluster);
        var nodes = cluster.nodes;
        var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus(nodes, cluster.id, $scope.statusMgr);

        clusterBasicData.amounts = countNodesAmount(nodesWithRoleAndStatus);
        var masters = nodesWithRoleAndStatus.masters;
        var slaves = nodesWithRoleAndStatus.slaves;
        var problemTips = setProblemTips(cluster.status, cluster.cluster_type, nodes.length);

        if (problemTips) {
            clusterBasicData.problemTips = problemTips;
            clusterBasicData.problemNodes = getProblemNodes(masters, slaves, cluster.status);
            clusterBasicData.needMasterIps = getNeedMasterIps(masters, cluster);
            if (clusterBasicData.needMasterIps.length > 0) {
                problemTips.firstButtonText = "添加主机";
            }
        }
        return clusterBasicData;
    }
    
    function getNeedMasterIps(masters, cluster) {
        var needMasterIps = [];
        angular.forEach(cluster.master_ips, function (masterIp) {
            var isExist = false;
            for (var status in masters) {
                var nodes = masters[status];
                for (var j=0; j<nodes.length; j++) {
                    if (nodes[j].ip === masterIp) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    break;
                }
            }
            if (!isExist) {
                needMasterIps.push(masterIp);
            }
        });
        return needMasterIps;
    }

    function getClusterNodesData(cluster, clickedStatus) {
        var clusterNodesData = {
            masters: [],
            firstGroupSlaves: [],
            followingGroupSlaves: [],
            selectedClasses: {}
        };
        var nodes = cluster.nodes;
        var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus(nodes, cluster.id, $scope.statusMgr);
        cluster.hiddenStatuses = cluster.hiddenStatuses? cluster.hiddenStatuses: [];
        var filteredNodes = filterNodes(nodesWithRoleAndStatus, cluster, clickedStatus);
        var allShowSlaves = getAllShowSlaves(filteredNodes.slaves);
        clusterNodesData.masters = getAllShowMasters(filteredNodes.masters);
        clusterNodesData.firstGroupSlaves = allShowSlaves.first;
        clusterNodesData.followingGroupSlaves = allShowSlaves.following;
        clusterNodesData.selectedClasses = getSelectedClass(cluster.hiddenStatuses);
        return clusterNodesData;
    }

    function getAllClustersBasicData() {
        var allClustersBasicData = [];
        if($scope.clusters.length) {
            angular.forEach($scope.clusters, function(cluster, clusterIndex) {
                allClustersBasicData[clusterIndex] = getClusterBasicData(cluster);
            });
        }
        return allClustersBasicData;
    }

    function getAllClustersNodesData() {
        var allClustersNodesData = [];
        var i;
        for (i = 0; i < $scope.clusters.length; i++) {
            allClustersNodesData[i] = getClusterNodesData($scope.clusters[i]);
        }
        return allClustersNodesData;
    }

    function getSelectedClass(hideStatuses) {
        var classes = {};
        var allStatuses = Object.keys(NODE_STATUS);
        angular.forEach(allStatuses, function(nodeStatus, index) {
            if (hideStatuses.indexOf(nodeStatus) > -1) {
                classes[nodeStatus] = 'unselected';
            } else {
                classes[nodeStatus] = '';
            }
        });
        return classes;
    }


    function setProblemTips(clusterStatus, clusterType, nodesAmount) {
        var tips = {};
        var needNumber = clusterLeastNodesNumber[clusterType] - nodesAmount;

        tips['new'] = {
            headText: '集群还需添加 ' +  needNumber + ' 台主机',
            firstButtonText: '继续添加主机',
            secondButtonText: '关闭'
        };
        tips['failed'] = {
            headText: '集群无法正常工作',
            paragraphText: '以下主机出现问题，致使集群无法正常工作。',
            firstButtonText: '尝试自动修复',
            secondButtonText: '知道了'
        };
        tips['abnormal'] = {
                headText: '集群可以正常工作，但存在异常服务',
                paragraphText: '以下主机出现问题。',
                firstButtonText: '尝试自动修复',
                secondButtonText: '知道了'
            };
        return tips[clusterStatus];
    }

    function getProblemNodes(masters, slaves, clusterStatus) {
        var problemNodes = [];
        angular.forEach(masters, function(nodes, status){
            if (status !== 'running') {
                problemNodes = problemNodes.concat(nodes);
            }
        })
        angular.forEach(slaves, function(nodes, status){
            if (status !== 'running') {
                problemNodes = problemNodes.concat(nodes);
            }
        })
        return problemNodes;
    }

    $scope.$on('$destroy', function () {
        $timeout.cancel(repairPromise);
    });

}

glanceApp.controller("listClustersCtrl", listClustersCtrl);
