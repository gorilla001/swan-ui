/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'LogLoader', '$timeout', 'multiSelectConfig'];

function logBaseCtrl($scope, $rootScope, glanceHttp, LogLoader, $timeout, multiSelectConfig) {
    $rootScope.show = "log";
    $scope.showContextUI = false;
    var clusterIdTemp;

    $scope.multiConfig = multiSelectConfig.setMultiConfig("全部选择", "清空", "恢复", "查询匹配词", "ALL");

    $scope.inputNodesInfo = [];

    $scope.clusterlogs = new LogLoader();
    $scope.contextlogs = new LogLoader();

    $scope.listCluster = function () {
        glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
            if (data && data.data && data.data.length !== 0) {
                $scope.clusters = data.data;
            }
        });
    };
    $scope.listCluster();

    $scope.$watch('clusterId', function (newValue, oldValue) {
        if (newValue) {
            $scope.getAppOptions(newValue);
        }
    });

    $scope.getNodePorts = function (appAliase, clusterId) {
        if (appAliase && clusterId) {
            glanceHttp.ajaxGet(["app.getNodePorts", {
                cluster_id: clusterId,
                clusterId: clusterId,
                app_aliase: appAliase
            }], function (data) {
                $scope.nodes = data.data;

                var tempNodesInfo = [];
                angular.forEach($scope.nodes, function (data, index, array) {
                    tempNodesInfo.push({
                        ip: data.Ip,
                        maker: data.Ip,
                        name: "实例" + (index + 1) + "(" + data.Ip + ")",
                        ticked: false
                    });
                });
                $scope.inputNodesInfo = tempNodesInfo;
            });
        }
    };

    $scope.getAppOptions = function (clusterId) {
        glanceHttp.ajaxGet(['app.options', {cluster_id: clusterId}], function (data) {
            $scope.options = data.data;
        });
    };

    $scope.isDisableGteDate = function (curDate, mode) {
        return curDate > $scope.lte;
    };
    $scope.isDisablelteDate = function (curDate, mode) {
        return curDate < $scope.gte;
    };

    $scope.getLog = function () {
        $scope.showContextUI = false;

        //set timeRange when click Button
        if ($scope.timeRange === undefined) {
            //defualt 3 min ago
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - 3 * 60 * 1000);
        } else if ($scope.timeRange !== 'other') {
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - $scope.timeRange * 60 * 1000);
        }

        $scope.searchData = {
            'gte': $scope.gte,
            'lte': $scope.lte,
            'clusterId': $scope.clusterId,
            'nodeId': $scope.nodeId,
            'appName': $scope.appName,
            'logSearchKey': $scope.logSearchKey
        };

        clusterIdTemp = $scope.searchData.clusterId;
        $scope.clusterlogs.searchLogs($scope.searchData);
    };


    $scope.getContextLog = function (logInfo, indexId) {
        $scope.curId = indexId;
        $scope.showContextUI = true;

        $scope.contextSearchData = {
            appName: $scope.appName,
            counter: parseInt(logInfo.counter[0]),
            timestamp: logInfo.timestamp[0],
            ipport: logInfo.ipport[0],
            clusterId: clusterIdTemp,
            size: 200
        };

        $scope.contextlogs.searchLogs($scope.contextSearchData, function (logSize) {
            $timeout(function () {
                var scrollHeight = 0;
                var oDiv = document.getElementById("contextLog");
                var oLi = document.getElementsByClassName("list-unstyled")[1].getElementsByTagName("li");
                for (var i = 0; i < oLi.length; i++) {
                    scrollHeight += oLi[i].offsetHeight;
                    if (oLi[i].className.indexOf('active') > 0) {
                        break;
                    }
                }
                oDiv.scrollTop = scrollHeight - oDiv.offsetHeight / 2;
            }, 250);
        });
    };

    $scope.returnLos = function () {
        $scope.showContextUI = false;
    };

    //datetimepicker option
    $scope.dateOptions = {
        startingDay: 1,
        showWeeks: false
    };
    $scope.showMeridian = false;

    $scope.$watch('timeRange', function () {
        //set precise time
        if ($scope.timeRange === 'other') {
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - 60 * 60 * 1000);
        }
    });
}