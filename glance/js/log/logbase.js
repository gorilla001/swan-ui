/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'LogLoader'];

function logBaseCtrl($scope, $rootScope, glanceHttp, LogLoader) {
    $rootScope.show = "log";
    moment.locale('zh-cn', {
        longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD/MM/YYYY",
            LL: "D MMMM YYYY",
            LLL: "D MMMM YYYY LT",
            LLLL: "dddd D MMMM YYYY LT"
        }
    });

    $scope.searchData = {
        lte: new Date(),
        gte: new Date((new Date()).getTime() - 60 * 60 * 1000)
    };

    $scope.multiConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "选择主机（ 可选 ）"
    };
    
    $scope.inputNodesInfo = [];

    $scope.clusterlogs = new LogLoader();

    $scope.listCluster = function () {
        glanceHttp.ajaxGet(['cluster.listClusters'], function (data) {
            if (data && data.data && data.data.length !== 0) {
                $scope.clusters = data.data;
            }
        });
    };
    $scope.listCluster();

    $scope.$watch('searchData.clusterId', function (newValue, oldValue) {
        if (newValue) {
            getNodes(newValue);
            $scope.getAppOptions(newValue);
        }
    });

    function getNodes(clusterId) {
        glanceHttp.ajaxGet(["cluster.getCluster", {cluster_id: clusterId}], function (data) {
            $scope.nodes = data.data.nodes;
            var tempNodesInfo = [];
            angular.forEach($scope.nodes, function (data, index, array) {
                tempNodesInfo.push({
                    name: "主机名:" + data.name,
                    maker: data.ip,
                    ticked: false
                });
            });
            $scope.inputNodesInfo = tempNodesInfo;

        });
    }

    $scope.getAppOptions = function (clusterId) {
        glanceHttp.ajaxGet(['app.options', {cluster_id: clusterId}], function (data) {
            $scope.options = data.data;
        });
    }

}