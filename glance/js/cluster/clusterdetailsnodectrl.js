function clusterNodesCtrl($scope, $rootScope, $stateParams, $state, $filter, glanceHttp, unitConversion, utils, monitor, labelService, Notification) {
    $rootScope.clusterClass = 'clusterNode';
    $scope.unitConversion = unitConversion;

    $scope.allLabels = [];
    $scope.allLabelNames = [];
    $scope.selectedLabels = [];
    $scope.unselectedLabels = [];
    $scope.label4Cluster = true;

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

        $scope.myConfirm(toast, function () {
            glanceHttp.ajaxDelete(["cluster.nodes", {"cluster_id": $stateParams.clusterId}], function (data) {
                $state.reload("cluster.clusterdetails");
            }, {"ids": nodeIds})
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
    $scope.changeLabels = function(checkedNodes) {
        $scope.checkedNodesIds = listChcekNodesIds(checkedNodes);
        labelService.changeLabels($scope);
    };

    $scope.labelledNode = function(label) {
        labelService.labelledNode(label, $scope);
    };

    $scope.tearLabel = function(label) {
        labelService.tearLabel(label, $scope);
    };

    $scope.labelledConfirm = function() {
        var postData = listRequestData();
        return glanceHttp.ajaxPost(
            ['cluster.nodeslabels', {'cluster_id': $stateParams.clusterId}],
            postData,
            function () {},
            undefined, function (resp) {
                Notification.error(resp.errors.labels);
            });
    };

    $scope.tearConfirm = function() {
        var deleteData = listRequestData();
        return glanceHttp.ajaxDelete(
            ['cluster.nodeslabels', {'cluster_id': $stateParams.clusterId}],
            function() {},
            deleteData,
            undefined, function(resp) {
                Notification.error(resp.errors.labels);
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

    function listRequestData() {
        var labelIds = $scope.getAllNodeLabelIds($scope.selectedLabels, 'id');
        var requsetData = {
            nodes: $scope.checkedNodesIds,
            labels: labelIds
        };
        return requsetData;
    }
}

clusterNodesCtrl.$inject = ["$scope", "$rootScope", "$stateParams", "$state", "$filter", "glanceHttp", "unitConversion", "utils", "monitor", "labelService", "Notification"];
glanceApp.controller("clusterNodesCtrl", clusterNodesCtrl);
