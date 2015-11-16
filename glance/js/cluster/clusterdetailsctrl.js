function clusterDetailsCtrl($scope, $stateParams, glanceHttp) {

    function getCurCluster() {
        glanceHttp.ajaxGet(["cluster.clusterIns", {cluster_id: $stateParams.clusterId}], function (data) {
            $scope.cluster = data.data;
            $scope.serviceState.master_type = $scope.cluster.cluster_type;
            $scope.totalItems = $scope.cluster.nodes.length;
            $scope.pageLength = 20;
            $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;

            $scope.currentPage = 1;
            var groupsWithState = $scope.groupMasterWithState($scope.cluster.nodes);
            $scope.contentPage = [];
            $.each(groupsWithState, function(key, val) {
                $scope.contentPage = $scope.contentPage.concat($scope.concatObjtoArr(val));
            });
            $scope.contentCurPage = $scope.contentPage.slice(0, $scope.pageLength);
        });
    }

    getCurCluster();
}

clusterDetailsCtrl.$inject = ["$scope", "$stateParams", "glanceHttp"];
glanceApp.controller("clusterDetailsCtrl", clusterDetailsCtrl);