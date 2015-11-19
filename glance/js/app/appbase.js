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

    $scope.appstate = {
        '1': "部署中",
        '2': "运行中",
        '3': "已停止",
        '4': "停止中 ",
        '5': "删除中"
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

        glanceHttp.ajaxGet(['cluster.listClusters'], function (data) {
            $scope.clusters = data.data;
            angular.forEach(data.data, function (cluster) {
                $scope.clusterNameMap[cluster.id] = cluster.name;
            });
            deferred.resolve();
        });

        return deferred.promise;
    };

    $scope.stopApp = function (appId, appName){
        glanceHttp.ajaxGet(['app.stop',{app_id: parseInt(appId)}], function (data) {
            if(data.data.stopState == 0){
                Notification.success('应用' + appName +' 停止中...');
                $state.go('app.applist',undefined,{reload : true});
            }
        },undefined, null, function(data){
            Notification.error('应用 ' + appName+' 停止失败:' + data.errors);
        });
    };

    $scope.startApp = function (appId, appName){
        glanceHttp.ajaxGet(['app.start',{app_id: parseInt(appId)}], function (data) {
            if(data.data.startState == 0){
                Notification.success('应用 '+ appName +' 启动中...');
                $state.go('app.applist',undefined,{reload : true});
            }
        },undefined, null, function(data){
            Notification.error('应用 '+ appName +' 启动失败: ' + data.errors);
        });
    };

    $scope.deleteApp = function (appId, appName) {
        $scope.myConfirm("您确定要删除应用吗？", function () {
            glanceHttp.ajaxGet(['app.deleteApp',{app_id: parseInt(appId)}], function (data) {
                if(data.data.deletState == 0){
                    Notification.success('应用 ' + appName + ' 删除中...');
                    $state.go('app.applist',undefined,{reload : true});
                }
            },undefined, null, function(data){
                Notification.error('应用 ' + appName + ' 删除失败: ' + data.errors);
            });
        });
    };

    $scope.upContainNum = function (appId, containerNum, appName) {
        $('#expandConNumModal').modal("show");
        $scope._expandConNum = containerNum;
        $scope._expandAppId = appId;
        $scope._appName = appName;
    };
    
    $scope.ensureExpandConNumCallback = function () {
        $scope.containDate = {
                "updateContainerNum": $scope._expandConNum,
                "appId": $scope._expandAppId.toString()
        };
        glanceHttp.ajaxPost(['app.upContainerNum'],$scope.containDate,function(data){
                $timeout(function () {
                    Notification.success('应用 '+ $scope._appName +' 扩容中...');
                    $state.go('app.applist',undefined,{reload : true})
                }, 200, true);
        },undefined, null, function(data){
            Notification.error( '应用 '+ $scope._appName + ' 扩容失败: ' + data.errors);
        });
    };

    $scope.getNode = function(clusterId){
        $scope.nodesOk = [];
        $scope.gateWays= [];
        $scope.proxyNodes = [];

        for(var index in $scope.clusters){
            if($scope.clusters[index].id === clusterId){
                for(var i =0; i< $scope.clusters[index].nodes.length; i++){
                    for(var j =0; j < $scope.clusters[index].nodes[i].attributes.length; j++){
                        if($scope.clusters[index].nodes[i].attributes[j].attribute === 'persistent'){
                            $scope.nodesOk.push($scope.clusters[index].nodes[i]);
                        }

                        if($scope.clusters[index].nodes[i].attributes[j].attribute === 'gateway'){
                            $scope.gateWays.push($scope.clusters[index].nodes[i]);
                        }

                        if($scope.clusters[index].nodes[i].attributes[j].attribute === 'proxy'){
                            $scope.proxyNodes.push($scope.clusters[index].nodes[i]);
                        }

                    }
                }
                break;
            }
        }
    };
}
