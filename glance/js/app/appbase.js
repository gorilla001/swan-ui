/**
 * Created by myu on 15-8-19.
 */
glanceApp.controller("appBaseCtrl", appBaseCtrl);

appBaseCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'glanceHttp', 'Notification', '$q', 'appCurd', '$stateParams'];

function appBaseCtrl($scope, $rootScope, $state, $timeout, glanceHttp, Notification, $q, appCurd, $stateParams) {
    $rootScope.show = "application";
    
    $scope.clusterNameMap = {};
    $scope.clusters = [];
    $scope.curAppNames = [];

    $scope.gateWays = [];
    $scope.proxyNodes = [];
    $scope.creatAppNodeList = [];

    $scope.allAppNames = [];

    $scope.appstate = {
        'undefined': "加载中",
        '1': "部署中",
        '2': "运行中",
        '3': "已停止",
        '4': "停止中 ",
        '5': "删除中",
        '6': "扩展中",
        '7': "启动中",
        '8': "撤销中",
        '9': "失联"
    };

    $scope.portType = {
        "1": "对内",
        "2": "对外"
    };

    $scope.protocolType = {
        "1": "TCP",
        "2": "HTTP"
    };

    $scope.addCode = APP_CODE;

    $scope.listCluster = function (isUsedNameMap) {
        return appCurd.getListCluster($scope, isUsedNameMap);
    };

    $scope.stopApp = function (appId, appName) {
        appCurd.stop(appId, appName);
    };

    $scope.startApp = function (appId, appName) {
        appCurd.start(appId, appName);
    };

    $scope.deleteApp = function (appId, appName) {
        appCurd.deleteApp(appId, appName)
    };

    $scope.undoApp = function (appId, appName) {
        appCurd.undoApp(appId, appName);
    };

    $scope.upContainNum = function (appId, containerNum, appName) {
        appCurd.updateOpenModal($scope, appId, containerNum, appName);
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
                        if ($scope.clusters[index].cluster_type === '1_master' || $scope.clusters[index].nodes[i].role !== 'master') {
                            $scope.creatAppNodeList.push($scope.clusters[index].nodes[i]);
                        }

                    }

                }
                break;
            }
        }
    };
}
