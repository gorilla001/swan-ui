function listClustersCtrl($scope, glanceHttp, $state, Notification) {
    var clusterTypes = {
        '1_master': 1,
        '3_masters': 3,
        '5_masters': 5,
    };

    var clusterLeastNodesNumber = {
        '1_master': 1,
        '3_masters': 4,
        '5_masters': 6,
    };

    $scope.clusterStatus = CLUSTER_STATUS;
    $scope.nodeStatus = NODE_STATUS;


    $scope.listCluster = function () {
        glanceHttp.ajaxGet(['cluster.listClusters'], function (data) {
            if (data && data.data) {
                $scope.getClusterNames(data.data);
                $scope.clusters = data.data;
                $scope.pageData = [];
                $scope.getPageData();
            }
        });
    };
    $scope.listCluster();

    $scope.toggleShowMoreNonMasters = function(clusterId) {
        $.each($scope.pageData, function(index, cluster) {
            if (cluster.basicInfos.id === clusterId) {
                if(!cluster.basicInfos.showMore) {
                    cluster.basicInfos.clickWords = '点击隐藏';
                } else {
                    cluster.basicInfos.clickWords = '点击显示更多';
                }
                cluster.basicInfos.showMore = !cluster.basicInfos.showMore;
            }
        });
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
         var keys = ['created_at', 'id', 'name', 'status', "updated_at"];
         if(cluster) {
            $.each(keys, function(index, key) {
                basicInfos[key] = cluster[key];
            });
         }
         basicInfos.showMore = '';
         basicInfos.clickWords = '点击显示更多';
         return basicInfos;
    }

    function setHiddenStatuses(hiddenStatuses, clickedStatus) {
         var index;
         if(hiddenStatuses.length) {
            index = hiddenStatuses.indexOf(clickedStatus);
            (index === -1) ? hiddenStatuses.push(clickedStatus): hiddenStatuses.splice(index, 1);
         } else {
            var showStatuses = Object.keys(NODE_STATUS);
            index = showStatuses.indexOf(clickedStatus);
            hiddenStatuses = showStatuses.splice(index, 1);
         }
         return hiddenStatuses;
    }


    function filtrateNonMasters(cluster, hideState) {
        var nodes = cluster.nodes;
        var nonMasters = $scope.groupNodesByRoleAndStatus(nodes).slaves;
        var showNonMasters = nonMasters;
        var index;
        if(hideState) {
            if(cluster.hideStates.length) {
                index = cluster.hideStates.indexOf(hideState);
                if(index === -1) {
                    cluster.hideStates.push(hideState);
                } else if(index > -1) {
                    cluster.hideStates.splice(index, 1);
                }
            } else {
                var showStates = Object.keys(NODE_STATUS);
                index = showStates.indexOf(hideState);
                showStates.splice(index,1);
                cluster.hideStates = showStates;
            }
            $.each(cluster.hideStates, function(stateIndex, val) {
                showNonMasters[val] = [];
            });
        }

        return showNonMasters;
    }

    function getAllShowNonMasters(cluster, hideState) {
        var showNonMasters = filtrateNonMasters(cluster, hideState);
        var allShowNonMasters = {
            first: [],
            following: []
        };
        var groupLength = 50;
        var nonMasters = [];
        if(showNonMasters) {
            nonMasters = $scope.concatObjtoArr(showNonMasters);

            allShowNonMasters.first = nonMasters.slice(0, groupLength);
            var nodesLength = nonMasters.length;
            if(nodesLength) {
                var groupNumber = Math.ceil(nodesLength / groupLength);
                if (groupNumber > 1) {
                    for(var i = 1; i < groupNumber; i++) {
                        allShowNonMasters.following[i-1] = nonMasters.slice(i * groupLength, (i+1)*groupLength);
                    }
                }
            }
        }
        return allShowNonMasters;
    }

    function getAllShowMasters(masters) {
        var allMasters = [];
        if(masters) {
            allMasters = $scope.concatObjtoArr(masters);
        }
        return allMasters;
    }

    function getSelectedClass(hideStates) {
        var classes = {};
        var showStates = Object.keys(NODE_STATUS);
        $.each(showStates, function(index, val) {
            classes[val] = '';
            if(hideStates.indexOf(val) > -1) {
                classes[val] = 'unselected';
            }
        });
        return classes;
    }

    function getSingleCluster(cluster, hideState) {
        var data = {};
        var group = {};
        var masters = {};
        var slaves = {};
        var nonMasters = {};
        if(!cluster.hideStates) {
            cluster.hideStates = [];
        }
        var nodes = cluster.nodes;
        data.basicInfos = getClusterBasicInfos(cluster);
        group = $scope.groupNodesByRoleAndStatus(nodes);
        data.amounts = countNodesAmount(group);
        masters = group.masters;
        slaves = group.slaves;

        data.masters = masters;
        data.slaves = slaves;
        data.allMasters = getAllShowMasters(masters);
        nonMasters = getAllShowNonMasters(cluster, hideState);
        data.firstNon = nonMasters.first;
        data.followingNon = nonMasters.following;
        data.classes = getSelectedClass(cluster.hideStates);
        data.clusterStatus = getSingleClusterStatus(masters, slaves, nodes, cluster.cluster_type);
        data.problemNodes = getProblemNodes(masters, slaves, data.clusterStatus);
        data.problemTips = setProblemTips(data.clusterStatus, cluster.cluster_type, nodes.length);
        return data;
    }

    $scope.getPageData = function(clusterId, hideState) {
        if($scope.clusters) {
            $.each($scope.clusters, function(clusterIndex, cluster) {
                if (clusterId && clusterId === cluster.id) {
                    $scope.pageData[clusterIndex] = getSingleCluster(cluster, hideState);
                } else if(!clusterId) {
                    $scope.pageData.push(getSingleCluster(cluster));
                }
            });
        }
    }

    $scope.close = function(clusterId, clusterStatus) {
        var i;
        if (clusterStatus === CLUSTER_STATUS.installing) {
            $state.go('cluster.addnode', {'clusterId': clusterId});
        } else {
            for (i = 0; i < $scope.pageData.length; i++) {
                if($scope.pageData[i].basicInfos.id === clusterId) {
                    $scope.pageData[i].problemTips = null;
                    break;
                }
            }
        }
    }

    function getSingleClusterStatus(masters, slaves, nodes, clusterType) {
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
        var i;
        for (i = 0; i < services.length; i++) {
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
            firstButtonText: '知道了'
        };
        tips[CLUSTER_STATUS.unknow] = {
            headText: '集群状态未知',
            paragraphText: '以下主机失联，请连接主机查看。',
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

}

listClustersCtrl.$inject = ["$scope", "glanceHttp", "$state", "Notification"];
glanceApp.controller("listClustersCtrl", listClustersCtrl);