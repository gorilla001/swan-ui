/**
 * Created by my9074 on 15/12/27.
 */
(function () {
    'use strict';
    angular.module('glance')
        .factory('appCurd', appCurd);

    appCurd.$inject = ['glanceHttp', 'Notification', '$state', 'openModule', '$rootScope', 'gHttp'];

    function appCurd(glanceHttp, Notification, $state, openModule, $rootScope, gHttp) {
        var CONTAINER_MODULE = "/views/app/updateContainerModule.html";
        var CONTAINER_CONTROLLER = "ModalContainerCtrl";
        var addCode = {
            100: "应用名称冲突",
            101: "端口冲突",
            102: "版本冲突",
            103: "应用被锁定",
            104: "撤销失败，应用扩展已完成",
            999: "网络异常"
        };

        var updateContainerInfo = {};

        return {
            stop: stop,
            start: start,
            deleteApp: deleteApp,
            undoApp: undoApp,
            resend: resend,
            updateOpenModal: updateOpenModal,
            updateAjax: updateAjax,
            getListCluster: getListCluster,
            getAppNameList: getAppNameList,
            isDeploy: isDeploy
        };

        function stop(appId, appName) {
            glanceHttp.ajaxGet(['app.stop', {app_id: parseInt(appId)}], function (data) {
                if (data.data.stopState == 0) {
                    Notification.success('应用' + appName + ' 停止中...');
                    $state.reload();
                }
            }, undefined, null, function (data) {
                Notification.error('应用 ' + appName + ' 停止失败:' + addCode[data.code]);
            });
        }

        function start(appId, appName) {
            glanceHttp.ajaxGet(['app.start', {app_id: parseInt(appId)}], function (data) {
                if (data.data.startState == 0) {
                    Notification.success('应用 ' + appName + ' 启动中...');
                    $state.reload();
                }
            }, undefined, null, function (data) {
                Notification.error('应用 ' + appName + ' 启动失败: ' + addCode[data.code]);
            });
        }

        function deleteApp(appId, appName) {
            $rootScope.myConfirm("您确定要删除应用吗？", function () {
                glanceHttp.ajaxGet(['app.deleteApp', {app_id: parseInt(appId)}], function (data) {
                    if (data.data.deletState == 0) {
                        Notification.success('应用 ' + appName + ' 删除中...');
                        $state.go('app.applist', null, {reload: true});
                    }
                }, undefined, null, function (data) {
                    Notification.error('应用 ' + appName + ' 删除失败: ' + $scope.addCode[data.code]);
                });
            });
        }

        function undoApp(appId, appName) {
            $rootScope.myConfirm("您确定要撤销扩展中的应用吗？", function () {
                glanceHttp.ajaxGet(['app.undoScaling', {app_id: parseInt(appId)}], function (data) {
                    Notification.success('应用 ' + appName + ' 撤销中...');
                    $state.reload();
                }, undefined, null, function (data) {
                    Notification.error('应用 ' + appName + ' 撤销失败: ' + $scope.addCode[data.code]);
                });
            });
        }

        function resend(appId, appName) {
            glanceHttp.ajaxGet(['app.resend', {app_id: parseInt(appId)}], function (data) {
                if (data.data.startState == 0) {
                    Notification.success('应用 ' + appName + ' 恢复中...');
                    $state.reload();
                }
            }, undefined, null, function (data) {
                Notification.error('应用 ' + appName + ' 恢复失败: ' + addCode[data.code]);
            });
        }

        function updateAjax(appId, containerNum, appName) {
            var _expandConNum = parseInt(containerNum);
            var containDate = {
                "updateContainerNum": _expandConNum,
                "appId": appId.toString()
            };

            return glanceHttp.ajaxPost(['app.upContainerNum'], containDate, function (data) {
            }, undefined, null, function (data) {
            });
        }

        function getUpdateAppInfo() {
            return updateContainerInfo
        }

        function setUpdateAppInfo(appId, containerNum, appName) {
            updateContainerInfo = {
                appId: appId,
                containerNum: containerNum,
                appName: appName
            }
        }

        function updateOpenModal(scope, appId, containerNum, appName) {
            setUpdateAppInfo(appId, containerNum, appName);
            openModule.open(undefined, scope, CONTAINER_MODULE, CONTAINER_CONTROLLER, undefined, undefined,
                getUpdateAppInfo)
        }

        function getListCluster(scope, isUsedNameMap) {
            return gHttp.Resource('cluster.clusters').get().then(function (data) {
                scope.clusters = data;
                if (isUsedNameMap) {
                    angular.forEach(data, function (cluster) {
                        scope.clusterNameMap[cluster.id] = cluster.name;
                    });
                }
            });
        }

        function getAppNameList(scope) {
            scope.allAppNames = [];
            return glanceHttp.ajaxGet(['app.allList'], function (data) {
                if (data.data && data.data.App) {
                    scope.allAppList = data.data.App;
                    angular.forEach(scope.allAppList, function (value, index) {
                        scope.allAppNames.push(value.appName);
                    });
                }
            });
        }

        function isDeploy(appId) {
            return glanceHttp.ajaxGet(['app.isdeploying', {app_id: appId}]);
        }

    }
})();