/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appBaseCtrl", appBaseCtrl);

appBaseCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'glanceHttp'];

function appBaseCtrl($scope, $rootScope, $state, $timeout, glanceHttp) {
    $rootScope.show = "application";

    $scope.clusterNameMap = {};
    $scope.clusters = [];

    $scope.appstate = {
        '1': "部署中",
        '2': "运行中",
        '3': "已停止",
        '4': "停止中 ",
        '5': "删除中"
    };

    $scope.listCluster = function () {
        glanceHttp.ajaxGet(['cluster.listClusters'], function (data) {
            $scope.clusters = data.data;
            angular.forEach(data.data, function (cluster) {
                $scope.clusterNameMap[cluster.id] = cluster.name;
            });
        });
    };

    $scope.stopApp = function (appId){
        glanceHttp.ajaxGet(['app.stop',{app_id: parseInt(appId)}], function (data) {
            if(data.data.stopState == 0){
                $state.go('app.applist',undefined,{reload : true});
            }
        },undefined, null, function(data){
            alert("停止失败: " + data.errors);
        });
    };

    $scope.startApp = function (appId){
        glanceHttp.ajaxGet(['app.start',{app_id: parseInt(appId)}], function (data) {
            if(data.data.startState == 0){
                $state.go('app.applist',undefined,{reload : true});
            }
        },undefined, null, function(data){
            alert("启动应用失败: " + data.errors);
        });
    };

    $scope.deleteApp = function (appId) {
        $scope.myConfirm("您确定要删除应用吗？", function () {
            glanceHttp.ajaxGet(['app.deleteApp',{app_id: parseInt(appId)}], function (data) {
                if(data.data.deletState == 0){
                    $state.go('app.applist',undefined,{reload : true});
                }
            },undefined, null, function(data){
                alert("删除应用失败: " + data.errors);
            });
        });
    };

    $scope.upContainNum = function (appId, containerNum) {
        $('#expandConNumModal').modal("show");
        $scope._expandConNum = containerNum;
        $scope._expandAppId = appId;
    };
    
    $scope.ensureExpandConNumCallback = function () {
        $scope.containDate = {
                "updateContainerNum": $scope._expandConNum,
                "appId": $scope._expandAppId.toString()
        };
        glanceHttp.ajaxPost(['app.upContainerNum'],$scope.containDate,function(data){
                $timeout(function () {
                    $state.go('app.applist',undefined,{reload : true})
                }, 200, true);
        },undefined, null, function(data){
            alert("扩容失败: " + data.errors);
        });
    };

    $scope.listCluster();
}
