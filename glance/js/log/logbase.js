/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'LogLoader', '$filter', '$timeout','$interval'];

function logBaseCtrl($scope, $rootScope, glanceHttp, LogLoader, $filter, $timeout, $interval) {
    $rootScope.show = "log";
    $scope.showContextUI = false;
    var clusterIdTemp;

    $scope.multiConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "ALL"
    };

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

    $scope.getNodePorts = function (appName, clusterId) {
        if (appName && clusterId) {
            glanceHttp.ajaxGet(["app.getNodePorts", {cluster_id: clusterId, clusterId: clusterId, app_name: appName}], function (data) {
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

    $scope.isDisableGteDate = function(curDate, mode) {
        return curDate > $scope.lte;
    };
    $scope.isDisablelteDate = function(curDate, mode) {
        return curDate < $scope.gte;
    };
    
    $scope.getLog = function () {
        $scope.showContextUI = false;
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
        var taskid = logInfo.taskid[0];

        $scope.contextSearchData = {
            counter:{
                conterGte: (Number(logInfo.counter.join()) - 100) ? Number(logInfo.counter.join()) - 100: 1, //Query the log and one hundred data
                conterLte: (Number(logInfo.counter.join()) + 100)
            },
            instanceName: taskid,
            clusterId: clusterIdTemp,
            size: 200
        };

        $scope.contextlogs.searchLogs($scope.contextSearchData, function (logSize) {
            $timeout(function(){
                var scrollHeight = 0;
                var Odiv = document.getElementById("contextLog");
                var Oli = document.getElementsByClassName("list-unstyled")[1].getElementsByTagName("li");
                for (var i = 0; i < Oli.length; i++) {
                    scrollHeight += Oli[i].offsetHeight;
                    if (Oli[i].className.indexOf('active') > 0) {
                        break;
                    }
                }
                Odiv.scrollTop = scrollHeight - Odiv.offsetHeight / 2;
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
        if($scope.timeRange === undefined){
            //defualt 3 min ago
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - 3 * 60 * 1000);
        }else if($scope.timeRange !== 'other'){
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - $scope.timeRange * 60 * 1000);
        }

    });
}