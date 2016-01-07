/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appVersionCtrl", appVersionCtrl);

appVersionCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', 'Notification', '$state', 'appCurd'];

function appVersionCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification, $state, appCurd) {
    $rootScope.appTabFlag = "appVersion";

    var getImageVersionsFlag = false;

    $scope.getImageVersions = function () {
        getImageVersionsFlag = true;
        return glanceHttp.ajaxGet(['app.imageVersions', {app_id: $stateParams.appId}], function (data) {
            if (data && data.data && data.data.length !== 0) {
                $scope.versions = data.data;
                $scope.totalItems = $scope.versions.length;
                $scope.pageLength = 10;
                $scope.showPagination = ($scope.totalItems > $scope.pageLength);
                $scope.contentCurPage = $scope.versions.slice(0, $scope.pageLength);
            }
        }, undefined, null, function (data) {
            Notification.error('获取镜像列表失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.cancelDeploy = function () {
        glanceHttp.ajaxGet(['app.cancelDeploy', {app_id: $stateParams.appId}], function (data) {
            if (data.code == 0) {
                $scope.getImageVersions();
                Notification.success('撤销成功');
            }
        }, undefined, null, function (data) {
            $scope.getImageVersions();
            Notification.error($scope.addCode[data.code] + '撤销失败');
        });
    };

    $scope.verisonDeploy = function (versionId) {
        glanceHttp.ajaxGet(['app.versionDeploy', {app_versionId: versionId}], function (data) {
            $scope.getImageVersions()
        }, undefined, null, function (data) {
            Notification.error('部署失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.deleteVersion = function (versionId) {
        $rootScope.myConfirm("您确定要删除该版本吗？", function () {
            glanceHttp.ajaxGet(['app.deleteVersion', {app_versionId: versionId}], function (data) {
                $scope.getImageVersions()
            }, undefined, null, function (data) {
                Notification.error('删除失败: ' + $scope.addCode[data.code]);
            });
        });
    };

    $scope.queryConfig = function (versionId) {
        glanceHttp.ajaxGet(['app.getVersionConfig', {app_versionId: versionId}], function (data) {
        }, undefined, null, function (data) {
            Notification.error('查询失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.contentCurPage = $scope.versions.slice(($scope.currentPage - 1) * $scope.pageLength, $scope.currentPage * $scope.pageLength);
    };

    $scope.getAppInfoPromise.then($scope.getImageVersions);

}