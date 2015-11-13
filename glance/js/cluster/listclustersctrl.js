function listClustersCtrl($scope, glanceHttp, $state, Notification) {
    var clusterTypes = {
        '1_master': 1,
        '3_master': 3,
        '5_master': 5,
    };


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

    function countNodesAmount(nodes) {
        var amounts = {};
        amounts.total = 0;
        var groupsWithState = $scope.groupMasterWithState(nodes);
        var showStates = Object.keys(NODE_STATUS);

        $.each(showStates, function(index, key) {
            amounts[key] = 0;
            $.each(groupsWithState, function(groupKey, group) {
                amounts[key] += group[key].length;
            });
            amounts.total += amounts[key];
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

    function filtrateNonMasters(cluster, hideState) {
        var nodes = cluster.nodes;
        var nonMasters = $scope.groupMasterWithState(nodes).nonMasters;
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
        data.amounts = countNodesAmount(nodes);
        group = $scope.groupMasterWithState(nodes)
        masters = group.masters;
        slaves = group.nonMasters;

        data.masters = masters;
        data.allMasters = getAllShowMasters(masters);
        nonMasters = getAllShowNonMasters(cluster, hideState);
        data.firstNon = nonMasters.first;
        data.followingNon = nonMasters.following;
        data.classes = getSelectedClass(cluster.hideStates);
        if (nodes.length) {
            data.clusterStatus = getSingleClusterStatus(masters, slaves, nodes, cluster.clusterType);
        }
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

    $scope.close = function(clusterId) {
        $.each($scope.pageData, function(index, cluster) {
            if(cluster.basicInfos.id === clusterId) {
                $scope.pageData[index].clusterState = false;
            }
        });
    }

    function getSingleClusterStatus(masters, slaves, nodes, clusterType) {
        var status;

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
        if (masters.terminated.length) {
            isUnknow = true;
        } else if (slaves.terminated.length){
            var slavesAmount = 0;
            angular.forEach(slaves, function(key, value) {
                slavesAmount += value.length;
            });
            isUnknow = Boolean(slaves.terminated.length === slavesAmount);
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
        var i;
        var service;
        var breakAmount = 0;
        for (i = 0; i < services.length; i++) {
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

}

listClustersCtrl.$inject = ["$scope", "glanceHttp", "$state", "Notification"];
glanceApp.controller("listClustersCtrl", listClustersCtrl);