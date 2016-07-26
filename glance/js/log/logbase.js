/**
 * Created by myu on 15-9-22.
 */
glanceApp.controller("logBaseCtrl", logBaseCtrl);

logBaseCtrl.$inject = ['$scope','$rootScope', 'LogLoader', '$timeout', 'multiSelectConfig', 'gHttp', 'appservice', 'clusterBackend', '$element'];

function logBaseCtrl($scope, $rootScope, LogLoader, $timeout, multiSelectConfig, gHttp, appservice, clusterBackend, $element) {
    $scope.showContextUI = false;
    $scope.logDownloadToplimit = $rootScope.LOG.logDownloadToplimit;
    var clusterIdTemp;

    $scope.multiConfig = multiSelectConfig.setMultiConfig("全部选择", "清空", "恢复", "查询匹配词", "ALL");

    $scope.inputNodesInfo = [];

    $scope.clusters = [];
    $scope.clusterlogs = new LogLoader();
    $scope.contextlogs = new LogLoader();
    $scope.inputLogPaths = [];
    $scope.clusterMapping = {};

    $scope.listCluster = function () {

        clusterBackend.listClusters()
            .then(function (clusters) {
                angular.forEach(clusters, function (cluster, index) {
                    if (cluster.group_id) {
                        $scope.clusters.push({id: cluster.id, name: cluster.group_name + ":" + cluster.name});
                    } else {
                        $scope.clusters.push({id: cluster.id, name: cluster.name});
                    }
                    $scope.clusterMapping[cluster.id] = cluster;
                });
            });
    };
    $scope.listCluster();

    $scope.$watch('clusterId', function (newValue, oldValue) {
        if (newValue) {
            $scope.getAppOptions(newValue);
        }
    });

    $scope.getNodePorts = function (appId, clusterId) {
        if (appId && clusterId) {
            $scope.inputNodesInfo = [];
            appservice.listAppNodes(clusterId, appId, '').then(function(data){
                $scope.nodes = data;

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
            fetchLogPathes();
        }
    };

    $scope.getAppOptions = function (clusterId) {
        appservice.listClusterAllApps(clusterId).then(function(data){
            $scope.options = data.App;
        });
    };

    $scope.isDisableGteDate = function (curDate, mode) {
        return curDate > $scope.lte || curDate < (new Date() - 7 * 24 * 60 * 60 * 1000) || curDate > new Date();
    };
    $scope.isDisablelteDate = function (curDate, mode) {
        return curDate < $scope.gte || curDate < (new Date() - 7 * 24 * 60 * 60 * 1000) || curDate > new Date();
    };
    
    $scope.timeRange="3";

    $scope.getLog = function () {
        var source = abstractValues($scope.logPaths, 'logpath');
        $scope.showContextUI = false;

        //set timeRange when click Button
        if ($scope.timeRange !== 'other') {
            $scope.lte = new Date();
            $scope.gte = new Date((new Date()).getTime() - $scope.timeRange * 60 * 1000);
        }

        $scope.searchData = {
            'gte': $scope.gte,
            'lte': $scope.lte,
            'clusterId': $scope.clusterId,
            'groupId': $scope.clusterMapping[$scope.clusterId].group_id,
            'nodeId': $scope.nodeId,
            'appName': $scope.app.alias,
            'logSearchKey': $scope.logSearchKey,
            'source':  source
        };

        clusterIdTemp = $scope.searchData.clusterId;
        $scope.clusterlogs.searchLogs($scope.searchData);
    };

    $scope.getContextLog = function (logInfo, indexId) {
        $scope.curId = indexId;
        $scope.showContextUI = true;

        $scope.contextSearchData = {
            appName: $scope.app.alias,
            counter: parseInt(logInfo.counter[0]),
            timestamp: logInfo.timestamp[0],
            ipport: logInfo.ipport[0],
            clusterId: clusterIdTemp,
            groupId: $scope.clusterMapping[clusterIdTemp].group_id,
            size: 200
        };

        if(logInfo.hasOwnProperty('source')){
            $scope.contextSearchData.source = logInfo.source[0]
        }

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
        listLogPathes($scope.clusterId, $scope.app.id)
            .then(function(data) {
                $scope.inputLogPaths = data;
            });
    }

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

    //stopPropagation for id:searchKey
    $element.find('#searchKey').on('keydown', function(ev) {
        ev.stopPropagation();
    });
}
