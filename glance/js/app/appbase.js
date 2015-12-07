/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appBaseCtrl", appBaseCtrl);

appBaseCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'glanceHttp','Notification', '$q'];

function appBaseCtrl($scope, $rootScope, $state, $timeout, glanceHttp, Notification, $q) {
    $rootScope.show = "application";

    $scope.clusterNameMap = {};
    $scope.clusters = [];
    $scope.curAppNames = [];

    $scope.nodesOk = [];
    $scope.gateWays= [];
    $scope.proxyNodes = [];
    $scope.transient = [];

    $rootScope.currentAppId;

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
        10: "应用名称冲突",
        11: "端口冲突",
        12: "版本冲突",
        13: "应用被锁定",
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
        });

        return deferred.promise;
    };

    $scope.stopApp = function (appId, appName){
        $rootScope.currentAppId = appId;
        glanceHttp.ajaxGet(['app.stop',{app_id: parseInt(appId)}], function (data) {
            if(data.data.stopState == 0){
                Notification.success('应用' + appName +' 停止中...');
                $state.go('app.applist', {appId: appId}, {reload : true});
            }
        },undefined, null, function(data){
            Notification.error('应用 ' + appName+' 停止失败:' + $scope.addCode[data.code]);
        });
    };

    $scope.startApp = function (appId, appName){
        $rootScope.currentAppId = appId;
        glanceHttp.ajaxGet(['app.start',{app_id: parseInt(appId)}], function (data) {
            if(data.data.startState == 0){
                Notification.success('应用 '+ appName +' 启动中...');
                $state.go('app.applist', {appId: appId}, {reload : true});
            }
        },undefined, null, function(data){
            Notification.error('应用 '+ appName +' 启动失败: ' + $scope.addCode[data.code]);
        });
    };

    $scope.deleteApp = function (appId, appName) {
        $rootScope.currentAppId = appId;
        $scope.myConfirm("您确定要删除应用吗？", function () {
            glanceHttp.ajaxGet(['app.deleteApp',{app_id: parseInt(appId)}], function (data) {
                if(data.data.deletState == 0){
                    Notification.success('应用 ' + appName + ' 删除中...');
                    $state.go('app.applist',{appId: appId},{reload : true});
                }
            },undefined, null, function(data){
                Notification.error('应用 ' + appName + ' 删除失败: ' + $scope.addCode[data.code]);
            });
        });
    };

    $scope.undoApp = function (appId, appName) {
        $rootScope.currentAppId = appId;
        $scope.myConfirm("您确定要撤销扩展中的应用吗？", function () {
            glanceHttp.ajaxGet(['app.undoScaling',{app_id: parseInt(appId)}], function (data) {
                    Notification.success('应用 ' + appName + ' 撤销中...');
                    $state.go('app.applist',{appId: appId},{reload : true});
            },undefined, null, function(data){
                Notification.error('应用 ' + appName + ' 撤销失败: ' + $scope.addCode[data.code]);
            });
        });
    };

    $scope.upContainNum = function (appId, containerNum, appName, isfromDetail) {
        $('#expandConNumModal').modal("show");
        $scope.tempNum = containerNum;
        $scope._expandConNum = containerNum;
        $scope._expandAppId = appId;
        $scope._appName = appName;
        $scope.fromDetail = isfromDetail;
    };
    
    $scope.ensureExpandConNumCallback = function (appId) {
        $rootScope.currentAppId = appId;
        $scope.containDate = {
                "updateContainerNum": $scope._expandConNum,
                "appId": $scope._expandAppId.toString()
        };
        if($scope.tempNum > $scope._expandConNum){
            $scope.updateContainerText = " 缩容中...";
            $scope.updateContainerErrorText = " 缩容失败 "
        }else{
            $scope.updateContainerText = " 扩容中...";
            $scope.updateContainerErrorText = " 扩容失败 "
        }
        glanceHttp.ajaxPost(['app.upContainerNum'],$scope.containDate,function(data){
                $timeout(function () {
                    Notification.success('应用 '+ $scope._appName +$scope.updateContainerText);
                    if($scope.fromDetail){
                        $state.go('app.appdetail.config',{appId: appId},{reload : true})
                    }else {
                        $state.go('app.applist',{appId: appId},{reload : true})

                    }
                }, 200, true);
        },undefined, null, function(data){
            Notification.error( '应用 '+ $scope._appName + $scope.updateContainerErrorText + $scope.addCode[data.code]);
        });
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
                    } else if ($scope.clusters[index].nodes[i].role !== 'master' && $scope.clusters[index].nodes[i].status === 'running') {
                        $scope.creatAppNodeList.push($scope.clusters[index].nodes[i]);

                    }

                }
                break;
            }
        }
    };
}
