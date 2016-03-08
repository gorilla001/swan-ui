/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', 'LogLoader', '$timeout', 'multiSelectConfig', 'gHttp', 'appservice'];

function logBaseCtrl($scope, $rootScope, glanceHttp, LogLoader, $timeout, multiSelectConfig, gHttp, appservice) {
    $rootScope.show = "log";
    $scope.showContextUI = false;
    $scope.logDownloadToplimit = LOG.logDownloadToplimit;
    var clusterIdTemp;

    $scope.multiConfig = multiSelectConfig.setMultiConfig("全部选择", "清空", "恢复", "查询匹配词", "ALL");

    $scope.inputNodesInfo = [];

    $scope.clusterlogs = new LogLoader();
    $scope.contextlogs = new LogLoader();
    $scope.inputLogPaths = [];

    $scope.listCluster = function () {
        gHttp.Resource('cluster.clusters').get().then(function (data) {
            if (data && data.length !== 0) {
                $scope.clusters = data;
            }
        })
    };
    $scope.listCluster();

    $scope.$watch('clusterId', function (newValue, oldValue) {
        if (newValue) {
            $scope.getAppOptions(newValue);
        }
    });

    $scope.getNodePorts = function (appId, clusterId) {
        if (appId && clusterId) {
            appservice.listAppInstances(clusterId, appId, '').then(function(data){
                $scope.nodes = data;

                var tempNodesInfo = [];
                angular.forEach($scope.nodes, function (data, index, array) {
                    tempNodesInfo.push({
                        ip: data.taskId,
                        maker: data.taskId,
                        name: "实例" + (index + 1) + "(" + data.taskId + ")",
                        ticked: false
                    });
                });
                $scope.inputNodesInfo = tempNodesInfo;
            });
            fetchLogPathes();
        }
    };

    $scope.getAppOptions = function (clusterId) {
        appservice.listClusterAllApps(clusterId).then(function(data){
            $scope.options = data.App;
        });
    };

    $scope.isDisableGteDate = function (curDate, mode) {
        return curDate > $scope.lte;
    };
    $scope.isDisablelteDate = function (curDate, mode) {
        return curDate < $scope.gte;
    };

    $scope.getLog = function () {
        var source = abstractValues($scope.logPaths, 'logpath');
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
            'appName': $scope.name,
            'logSearchKey': $scope.logSearchKey,
            'source':  source
        };

        clusterIdTemp = $scope.searchData.clusterId;
        $scope.clusterlogs.searchLogs($scope.searchData);
    };

    $scope.downloadSearchLogs = function(){
        $scope.clusterlogs.downloadSearchLogs();
    };

    $scope.downloadContextLogs = function(){
        $scope.contextlogs.downloadContextLogs();
    };


    $scope.getContextLog = function (logInfo, indexId) {
        $scope.curId = indexId;
        $scope.showContextUI = true;

        $scope.contextSearchData = {
            appName: $scope.name,
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

    function fetchLogPathes() {
        listLogPathes($scope.clusterId, $scope.appId)
            .then(function(data) {
                $scope.inputLogPaths = data;
            });
    };

    function listLogPathes(clusterId, appId) {
        var urlParams = {
            cluster_id: clusterId,
            app_id: appId
        };
        return gHttp.Resource('app.logPaths', urlParams).get();
    }

    function abstractValues(array, keywords) {
        var values = [];
        angular.forEach(array, function(item, index) {
            angular.forEach(item, function(value, key) {
                if (keywords === key) {
                    values.push(value);
                }
            });
        });
        return values;
    }
}
