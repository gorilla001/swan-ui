function listClustersCtrl($scope, glanceHttp, $state, Notification) {
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
        var masters = {};
        var nonMasters = {};
        if(!cluster.hideStates) {
            cluster.hideStates = [];
        }
        var nodes = cluster.nodes;
        data.basicInfos = getClusterBasicInfos(cluster);
        data.amounts = countNodesAmount(nodes);
        masters = $scope.groupMasterWithState(nodes).masters;
        data.clusterState = isClusterBroken(masters);

        data.masters = masters;
        data.allMasters = getAllShowMasters(masters);
        nonMasters = getAllShowNonMasters(cluster, hideState);
        data.firstNon = nonMasters.first;
        data.followingNon = nonMasters.following;
        data.classes = getSelectedClass(cluster.hideStates);
        return data;
    }


    function isClusterBroken(masters) {
        var isBroken = false;
        var amount = 0;
        var brokenAmount = 0;
        var brokenStates = [NODE_STATUS.terminated, NODE_STATUS.failed];
        var showStates = Object.keys(NODE_STATUS);
        $.each(showStates, function(index, val) {
            amount += masters[val].length;
            if(brokenStates.indexOf(val) > -1) {
                brokenAmount += masters[val].length;
            }
        });
        if (brokenAmount >= Math.ceil(amount/2)) {
            isBroken = true;
        }
        return isBroken;
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
}

listClustersCtrl.$inject = ["$scope", "glanceHttp", "$state", "Notification"];
glanceApp.controller("listClustersCtrl", listClustersCtrl);
