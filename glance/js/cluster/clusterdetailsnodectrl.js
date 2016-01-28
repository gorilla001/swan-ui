function clusterNodesCtrl($scope, $rootScope, $stateParams, $state, $filter, glanceHttp, unitConversion, utils, monitor) {
    $rootScope.clusterClass = 'clusterNode';
    $scope.unitConversion = unitConversion;

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

    function filterLabelNodes(labelName) {
        $scope.contentCurPage = [];

        if (labelName) {
            $scope.showPagination = false;
            angular.forEach($scope.cluster.nodes, function (node, nodeIndex) {
                angular.forEach(node.node_labels, function (label, labelIndex) {
                    if (angular.equals(label.label.name, labelName)) {
                        $scope.contentCurPage.push($scope.cluster.nodes[nodeIndex])
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
}

clusterNodesCtrl.$inject = ["$scope", "$rootScope", "$stateParams", "$state", "$filter", "glanceHttp", "unitConversion", "utils", "monitor"];
glanceApp.controller("clusterNodesCtrl", clusterNodesCtrl);
