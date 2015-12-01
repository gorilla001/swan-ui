function clusterDetailsCtrl($scope, $stateParams, glanceHttp) {

    $scope.statusCache = {};
    function getCurCluster() {
        glanceHttp.ajaxGet(["cluster.clusterIns", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.cluster = data.data;
            $scope.totalItems = $scope.cluster.nodes.length;
            $scope.pageLength = 20;
            $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;

            $scope.currentPage = 1;
            var nodesWithRoleAndStatus = $scope.groupNodesByRoleAndStatus($scope.cluster.nodes, $scope.cluster.id, $scope.statusCache);
            $scope.startListenStatusUpdate($scope.statusCache);
            $scope.contentPage = [];
            $.each(nodesWithRoleAndStatus, function(key, val) {
                $scope.contentPage = $scope.contentPage.concat($scope.concatObjtoArr(val));
            });
            $scope.contentCurPage = $scope.contentPage.slice(0, $scope.pageLength);
        });
    }

    getCurCluster();
}

clusterDetailsCtrl.$inject = ["$scope", "$stateParams", "glanceHttp"];
glanceApp.controller("clusterDetailsCtrl", clusterDetailsCtrl);