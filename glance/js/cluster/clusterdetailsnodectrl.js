function clusterNodesCtrl($scope, $rootScope, $stateParams, $state, $filter, glanceHttp, unitConversion, utils, monitor) {
    $rootScope.clusterClass = 'clusterNode';
    $scope.unitConversion = unitConversion;

    $scope.refresh = function(){
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
            glanceHttp.ajaxPost(["cluster.delNodes"], {"ids": nodeIds}, function (data) {
                $state.reload("cluster.clusterdetails");
            })
        });
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.contentCurPage = $scope.contentPage.slice(($scope.currentPage - 1) * $scope.pageLength,$scope.currentPage * $scope.pageLength);
    };
}

clusterNodesCtrl.$inject = ["$scope", "$rootScope", "$stateParams", "$state", "$filter", "glanceHttp", "unitConversion", "utils", "monitor"];
glanceApp.controller("clusterNodesCtrl", clusterNodesCtrl);
