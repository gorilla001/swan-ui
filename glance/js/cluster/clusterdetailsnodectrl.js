function clusterNodesCtrl($scope, $stateParams, $state, $filter, gHttp, unitConversion, utils, monitor, labelService, Notification, confirmModal) {
    $scope.unitConversion = unitConversion;

    $scope.allLabels = [];
    $scope.allLabelNames = [];
    $scope.selectedLabels = [];
    $scope.unselectedLabels = [];
    $scope.checkedNodeLabels = [];
    $scope.labelForm = {};

    $scope.refresh = function () {
        $state.reload("cluster.clusterdetails");
    };

    $scope.deleteNodes = function (nodes) {
        var toast = "您确定要移除主机吗？";
        var nodeIds = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeIds.push(nodes[i].id);
            if (nodes[i].role == 'master') {
                toast = "您所删除的主机中包含 Master,删除后会引起故障，是否继续删除？";
            }
        }

        confirmModal.open(toast).then(function () {
            gHttp.Resource('cluster.nodes', {"cluster_id": $stateParams.clusterId}).delete({'data':nodeIds}).then(function () {
                $state.reload("cluster.clusterdetails");
            });
        });
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.contentCurPage = $scope.contentPage.slice(($scope.currentPage - 1) * $scope.pageLength, $scope.currentPage * $scope.pageLength);
    };

    // do search
    $scope.doSearch = function (searchKey) {
        filterLabelNodes(searchKey)
    };

    // labels
    $scope.showAddLabelModal = function(checkedNodes) {
        $scope.checkedNodesIds = listChcekNodesIds(checkedNodes);
        $scope.selectedLabels = [];
        labelService.changeLabels($scope)
            .then(function() {
                $scope.allLabelNames = $scope.getAllLabelNames($scope.allLabels, 'name');
            });
    };

    $scope.showTearLabelModal = function(checkedNodes) {
        $scope.checkedNodesIds = listChcekNodesIds(checkedNodes);
        $scope.selectedLabels = listCheckedNodeLables($scope.checkedNodesIds);
        $scope.unselectedLabels = [];
        $scope.showNoLabelTip = $scope.selectedLabels.length ? false : true;
    };

    $scope.labelledNode = function(label) {
        labelService.labelledNode(label, $scope);
    };

    $scope.tearLabel = function(label) {
        labelService.tearLabel(label, $scope);
    };

    $scope.createLabel = function() {
        labelService.createLabel($scope);
    };

    $scope.deleteLabel = function(label) {
        labelService.deleteLabel(label, $scope);
    };

    $scope.labelledConfirm = function() {
        var postData = listRequestData($scope.selectedLabels);
        return gHttp.Resource('cluster.nodesLabels', {'cluster_id': $stateParams.clusterId}).
            post(postData).then(function() {
                updateClusterLabels($stateParams.clusterId);
                updateContentPage();
            }, function(data) {
                Notification.error(data.data.labels);
            });
    };

    $scope.tearConfirm = function() {
        var deleteData = listRequestData($scope.unselectedLabels);
        return gHttp.Resource('cluster.nodesLabels', {'cluster_id': $stateParams.clusterId})
            .delete({'data': deleteData}).then(function() {
                updateClusterLabels($stateParams.clusterId);
                updateContentPage();
            }, function(resp) {
                Notification.error(resp.data.labels);
            });
    };

    function filterLabelNodes(labelName) {
        $scope.contentCurPage = [];

        if (labelName) {
            $scope.showPagination = false;
            angular.forEach($scope.contentPage, function (node, nodeIndex) {
                angular.forEach(node.node_labels, function (label, labelIndex) {
                    if (angular.equals(label.label.name, labelName)) {
                        $scope.contentCurPage.push($scope.contentPage[nodeIndex])
                    }
                })
            });

            if(!$scope.contentCurPage.length){

            }
        } else {
            $scope.showPagination = $scope.totalItems > $scope.pageLength;
            $scope.contentCurPage = $scope.contentPage.slice(($scope.currentPage - 1) * $scope.pageLength, $scope.currentPage * $scope.pageLength);
        }
    }

    function listChcekNodesIds(checkedNodes) {
        var checkedNodesIds = [];
        angular.forEach(checkedNodes, function(node, index) {
            checkedNodesIds.push(node.id);
        });
        return checkedNodesIds;
    }

    function listRequestData(labels) {
        var labelIds = $scope.getAllNodeLabelIds(labels, 'id');
        var requsetData = {
            nodes: $scope.checkedNodesIds,
            labels: labelIds
        };
        return requsetData;
    }

    function updateClusterLabels(clusterId) {
        labelService.listClusterLabels(clusterId)
            .then(function(data) {
                $scope.clusterLabels = $scope.collectClusterLabels(data.nodes);
            });
    }

    function listCheckedNodeLables(checkedNodeIds) {
        var checkedNodeLables = [];
        var labelIds = [];
        angular.forEach(checkedNodeIds, function(nodeId, index) {
            checkedNodeLables = checkedNodeLables.concat($scope.clusterLabels[nodeId]);
        });
        checkedNodeLables = removeReduplicateLabels(checkedNodeLables);
        return checkedNodeLables;
    };

    function removeReduplicateLabels(allLabels) {
        var labels = [];
        var labelIds = [];
        angular.forEach(allLabels, function(label, index) {
            if(labelIds.indexOf(label.id) === -1) {
                labelIds.push(label.id);
                labels.push(label);
            }
        });
        return labels;
    }

    function updateContentPage() {
        $scope.getCurCluster();
    }

}

clusterNodesCtrl.$inject = ["$scope", "$stateParams", "$state", "$filter", "gHttp", "unitConversion", "utils", "monitor", "labelService", "Notification" , "confirmModal"];
glanceApp.controller("clusterNodesCtrl", clusterNodesCtrl);
