function listClustersCtrl($scope, $state, Notification, ClusterStatusMgr, $timeout, gHttp) {
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

    var repairPromise;

    $scope.statusMgr = new ClusterStatusMgr();
    
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

    $scope.close = function (clusterId, index, clusterStatus) {
        if (clusterStatus === CLUSTER_STATUS.installing) {
            $state.go('cluster.nodesource', {'clusterId': clusterId});
        } else if (clusterStatus === CLUSTER_STATUS.abnormal) {
            $scope.clustersBasicData[index].problemTips.firstBtnDisable = true;
            $scope.clustersBasicData[index].problemTips.firstButtonText = "正在修复中";
            gHttp.Resource('cluster.cluster', {'cluster_id': clusterId}).patch({"method": "repair"}).then(function(){
                $timeout.cancel(repairPromise);
                repairPromise = $timeout(function () {
                    $state.reload();
                }, 60000);
            });
        } else {
            $scope.clustersBasicData[index].problemTips = null;
        }
    };

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
         if(hiddenStatuses.length) {
            index = hiddenStatuses.indexOf(clickedStatus);
            (index === -1) ? hiddenStatuses.push(clickedStatus): hiddenStatuses.splice(index, 1);
         } else {
            var showStatuses = Object.keys(NODE_STATUS);
            index = showStatuses.indexOf(clickedStatus);
            showStatuses.splice(index, 1);
            hiddenStatuses = showStatuses;
         }
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
            problemNodes: [],
            clusterStatus: ''
        };
        clusterBasicData.infos = getClusterBasicInfos(cluster);
        var nodes = cluster.nodes;
        var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus(nodes, cluster.id, $scope.statusMgr);

        clusterBasicData.amounts = countNodesAmount(nodesWithRoleAndStatus);
        var masters = nodesWithRoleAndStatus.masters;
        var slaves = nodesWithRoleAndStatus.slaves;
        var clusterStatus = getClusterStatus(masters, slaves, nodes, cluster.cluster_type);
        clusterBasicData.clusterStatus = clusterStatus;
        var problemTips = setProblemTips(clusterStatus, cluster.cluster_type, nodes.length);

        if (problemTips) {
            clusterBasicData.problemTips = problemTips;
            clusterBasicData.problemNodes = getProblemNodes(masters, slaves, clusterStatus);
        }
        return clusterBasicData;
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

    function getClusterStatus(masters, slaves, nodes, clusterType) {
        var status;
        if(!nodes.length) {
            return;
        }

        if (isClusterUnknow(masters, slaves)) {
            return CLUSTER_STATUS.unknow;
        }

        var needServices = getClusterNeedServices(nodes);
        var masterServices = needServices.masterServices;
        var slaveServices = needServices.slaveServices;

        if (isClusterRunning(masterServices, slaveServices, clusterType)) {
            status = CLUSTER_STATUS.running;
        } else if (isCusterInstalling(masterServices, slaveServices, clusterType)) {
            status = CLUSTER_STATUS.installing;
        } else {
            status = CLUSTER_STATUS.abnormal;
        }
        return status;
    }

    function isClusterUnknow(masters, slaves) {
        var isUnknow = false;
        if (masters[NODE_STATUS.terminated].length) {
            isUnknow = true;
        } else if (slaves[NODE_STATUS.terminated].length){
            var slavesAmount = 0;
            angular.forEach(slaves, function(value, key) {
                slavesAmount += value.length;
            });
            isUnknow = Boolean(slaves[NODE_STATUS.terminated].length === slavesAmount);
        }
        return isUnknow;
    }

    function isClusterRunning(masterServices, slaveServices, clusterType) {
        var isRunning = false;
        var status = [NODE_STATUS.running];

        var runningMasterAmount = calStatusAmount(masterServices, status);
        if (runningMasterAmount === clusterTypes[clusterType]) {
            if (calStatusAmount(slaveServices, status) >= 1) {
                isRunning = true;
            }
        }
        return isRunning;
    }

    function isCusterInstalling(masterServices, slaveServices, clusterType) {
        var isInstalling = false;
        var status = [SERVICES_STATUS.running, SERVICES_STATUS.failed];
        var totalMaster = calStatusAmount(masterServices, status);
        var totalSlave = calStatusAmount(slaveServices, status);
        return Boolean((totalMaster < clusterTypes[clusterType]) || (totalSlave === 0));
    }

    function getClusterNeedServices(nodes) {
        var clusterNeedServices = {
            masterServices: [],
            slaveServices: []
        };
        var needServices = {};
        var i;
        var node;
        
        for (i = 0; i < nodes.length; i ++) {
            node = nodes[i];
            needServices = getNodeNeedServices(node.services);
            clusterNeedServices.masterServices.push(needServices.master);
            clusterNeedServices.slaveServices.push(needServices.slave);
        }
        return clusterNeedServices;
    }

    function getNodeNeedServices(services) {
        var nodeNeedServices = {
            'master': {},
            'slave': {}
        };
        var names = Object.keys(nodeNeedServices);
        var service;
        var breakAmount = 0;
        for (var i = 0; i < services.length; i++) {
            service = services[i];
            
            if (names.indexOf(service.name) > -1) {
                nodeNeedServices[service.name] = service;
                breakAmount += 1;
            }
            if (breakAmount === names.length) {
                break;
            }
        }
        return nodeNeedServices;
    }

            
    function calStatusAmount(services, status) {
        var amount = 0;
        for (var i = 0; i < services.length; i++) {
            service = services[i];
            amount += (status.indexOf(service.status) > -1 ? 1 : 0);
        }
        return amount;
    }

    function setProblemTips(clusterStatus, clusterType, nodesAmount) {
        if (!clusterStatus || (clusterStatus === CLUSTER_STATUS.running)) {
            return;
        }
        var tips = {};
        var needNumber = clusterLeastNodesNumber[clusterType] - nodesAmount;
        var installingHeadText;
        if (needNumber <= 0) {
            installingHeadText = '集群初始化中';
        } else {
            installingHeadText = '集群初始化中，还需添加 ' +  needNumber + ' 台主机';
        }

        tips[CLUSTER_STATUS.installing] = {
            headText: installingHeadText,
            paragraphText: '以下主机初始化中',
            firstButtonText: '继续添加主机',
            secondButtonText: '关闭'
        };
        tips[CLUSTER_STATUS.abnormal] = {
            headText: '集群无法正常工作',
            paragraphText: '以下主机出现问题，致使集群无法正常工作。',
            firstButtonText: '尝试自动修复',
            secondButtonText: '知道了'
        };
        tips[CLUSTER_STATUS.unknow] = {
            headText: '集群状态未知',
            paragraphText: '以下主机不能正常工作，请连接主机查看。',
            firstButtonText: '知道了'
        };
        return tips[clusterStatus];
    }

    function getProblemNodes(masters, slaves, clusterStatus) {
        var problemNodes = [];
        var nodeTypes = [masters, slaves];
        var problemStatus = [];
        if (clusterStatus === CLUSTER_STATUS.installing) {
            problemStatus = [NODE_STATUS.installing];
        } else {
            problemStatus = [NODE_STATUS.terminated, NODE_STATUS.failed, NODE_STATUS.installing];
        }
        angular.forEach(nodeTypes, function(type, typeIndex) {
            angular.forEach(problemStatus, function(status, statusIndex) {
                problemNodes = problemNodes.concat(type[status]);
            });
        });
        return problemNodes;
    }

    $scope.$on('$destroy', function () {
        $timeout.cancel(repairPromise);
    });

}

listClustersCtrl.$inject = ["$scope", "$state", "Notification", "ClusterStatusMgr", "$timeout", "gHttp"];
glanceApp.controller("listClustersCtrl", listClustersCtrl);
