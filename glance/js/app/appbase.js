/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appBaseCtrl", appBaseCtrl);

appBaseCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'glanceHttp','Notification', '$q', 'appCurd'];

function appBaseCtrl($scope, $rootScope, $state, $timeout, glanceHttp, Notification, $q, appCurd) {
    $rootScope.show = "application";

    $scope.clusterNameMap = {};
    $scope.clusters = [];
    $scope.curAppNames = [];

    $scope.gateWays= [];
    $scope.proxyNodes = [];
    $scope.creatAppNodeList = [];

    $scope.allAppNames = [];

    $scope.appstate = {
        '1': "部署中",
        '2': "运行中",
        '3': "已停止",
        '4': "停止中 ",
        '5': "删除中",
        '6': "扩展中"
    };

    $scope.portType = {
        "1": "对内",
        "2": "对外"
    };

    $scope.protocolType = {
        "1": "TCP",
        "2": "HTTP"
    };

    $scope.addCode = {
        100: "应用名称冲突",
        101: "端口冲突",
        102: "版本冲突",
        103: "应用被锁定",
        104: "撤销失败，应用扩展已完成",
        999: "网络异常"
    };

    $scope.listCluster = function () {
        var deferred = $q.defer();

        glanceHttp.ajaxGet(['cluster.clusters'], function (data) {
            $scope.clusters = data.data;
            angular.forEach(data.data, function (cluster) {
                $scope.clusterNameMap[cluster.id] = cluster.name;
            });
            deferred.resolve();
        }, null, function(data, status){
            console.log("request failed (" + status + ")");
        }, function(data){
            console.log(data.errors);
        });

        return deferred.promise;
    };

    $scope.stopApp = function (appId, appName){
        appCurd.stop(appId, appName);
    };

    $scope.startApp = function (appId, appName){
        appCurd.start(appId, appName);
    };

    $scope.deleteApp = function (appId, appName) {
        appCurd.deleteApp(appId, appName)
    };

    $scope.undoApp = function (appId, appName) {
        appCurd.undoApp(appId, appName);
    };

    $scope.upContainNum = function (appId, containerNum, appName) {
        appCurd.setUpdateAppInfo(appId, containerNum, appName);
        appCurd.updateOpenModal($scope);
    };

    $scope.getNode = function (clusterId) {
        $scope.gateWays = [];
        $scope.proxyNodes = [];
        $scope.creatAppNodeList = [];

        for (var index in $scope.clusters) {
            if ($scope.clusters[index].id === clusterId) {
                for (var i = 0; i < $scope.clusters[index].nodes.length; i++) {
                    if ($scope.clusters[index].nodes[i].attributes.length) {
                        for (var j = 0; j < $scope.clusters[index].nodes[i].attributes.length; j++) {
                            if ($scope.clusters[index].nodes[i].attributes[j].attribute === 'gateway') {
                                $scope.gateWays.push($scope.clusters[index].nodes[i]);
                            }

                            if ($scope.clusters[index].nodes[i].attributes[j].attribute === 'proxy') {
                                $scope.proxyNodes.push($scope.clusters[index].nodes[i]);
                            }
                        }
                    }

                    if ($scope.clusters[index].nodes[i].status === 'running') {
                        if($scope.clusters[index].cluster_type === '1_master' || $scope.clusters[index].nodes[i].role !== 'master'){
                            $scope.creatAppNodeList.push($scope.clusters[index].nodes[i]);
                        }

                    }

                }
                break;
            }
        }
    };

    // get all app list to Check repeat
    $scope.getAppName = function () {
        var deferred = $q.defer();
        $scope.allAppNames = [];
        glanceHttp.ajaxGet(['app.allList'], function (data) {
            if (data.data && data.data.App) {
                $scope.allAppList = data.data.App;
                angular.forEach($scope.allAppList, function (value, index) {
                    $scope.allAppNames.push(value.appName);
                });
            }
            deferred.resolve();
        });
        return deferred.promise;
    }
}
