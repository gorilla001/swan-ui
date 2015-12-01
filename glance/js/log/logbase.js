/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'LogLoader', '$filter', '$timeout','$interval'];

function logBaseCtrl($scope, $rootScope, glanceHttp, LogLoader, $filter, $timeout, $interval) {
    $rootScope.show = "log";
    $scope.showContextUI = false;
    var clusterIdTemp,promise;

    $scope.lte = new Date();
    $scope.gte = new Date((new Date()).getTime() - 60 * 60 * 1000);

    promise = $interval(function(){
        $scope.lte = new Date();
        $scope.gte = new Date((new Date()).getTime() - 60 * 60 * 1000);
    },60000);

    $scope.multiConfig = {
        selectAll: "全部选择",
        selectNone: "清空",
        reset: "恢复",
        search: "查询匹配词",
        nothingSelected: "选择主机（ 可选 ）"
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

    $scope.getNodes = function (appName, clusterId) {
        if (appName && clusterId) {
            glanceHttp.ajaxGet(["app.getNodes", {cluster_id: clusterId, clusterId: clusterId, app_name: appName}], function (data) {
                $scope.nodes = data.data;

                var tempNodesInfo = [];
                angular.forEach($scope.nodes, function (data, index, array) {
                    tempNodesInfo.push({
                        ip: data.Ip,
                        maker: data.Ip,
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
        var ip = logInfo.ip[0];
        var taskid = logInfo.taskid[0];
        var date = moment(logInfo.timestamp[0]).toDate();

        function getContextLogTotal(times, total) {
            times += 1;
            addDate = moment(logInfo.timestamp[0]).add(120 * times, 's').toDate();
            subDate = moment(logInfo.timestamp[0]).subtract(120 * times, 's').toDate();
            var startDate = $filter('date')(subDate, 'yyyy-MM-ddTHH:mm:ss');
            var endDate = $filter('date')(addDate, 'yyyy-MM-ddTHH:mm:ss');
            $scope.searchData = {
                'gte': startDate,
                'lte': endDate,
                'nodeId': new Array(ip),
                'instanceName': taskid,
                'clusterId': clusterIdTemp,
                'size': 0
            };
            $scope.contextlogs.searchLogs($scope.searchData, function (logSize) {
                if (logSize < total && times < 6) {
                    getContextLogTotal(times, total);
                } else {
                    $scope.searchData = {
                        'gte': startDate,
                        'lte': endDate,
                        'nodeId': new Array(ip),
                        'instanceName': taskid,
                        'clusterId': clusterIdTemp,
                        'size': total
                    };
                    $scope.contextlogs.searchLogs($scope.searchData,function(){
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
                }
            });
        }

        getContextLogTotal(0, 100);
        $scope.showContextUI = true;
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

    $scope.$on('$destroy', function () {
        $timeout.cancel(promise);
    });
}