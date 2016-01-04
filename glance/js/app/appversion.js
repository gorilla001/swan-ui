/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appVersionCtrl", appVersionCtrl);

appVersionCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', 'Notification', '$state', 'appCurd'];

function appVersionCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification, $state, appCurd) {
    $rootScope.appTabFlag = "appVersion";
    var promise;
    var IS_NOT_DEPLOYED = 0;
    var IS_DEPLOYED = 1;
    $scope.counter = 0;

    $scope.getImageVersions = function () {
        glanceHttp.ajaxGet(['app.imageVersions', {app_id: $stateParams.appId}], function (data) {
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
                Notification.success('取消部署成功');
            }
        }, undefined, null, function (data) {
            Notification.error('取消部署失败');
        });
    };

    $scope.verisonDeploy = function (versionId) {
        glanceHttp.ajaxGet(['app.versionDeploy', {app_versionId: versionId}], function (data) {
            $scope.counter = 0;
            $scope.isDeploy()
        }, undefined, null, function (data) {
            Notification.error('部署失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.isDeploy = function(){
        glanceHttp.ajaxGet(['app.isdeploying',{app_id: $stateParams.appId}], function (data) {
            $scope.isDeployState = data.data.isdeploying;
            if($scope.isDeployState === IS_NOT_DEPLOYED){
                $scope.counter += 1;
                if(data.data.info !== "" && $scope.counter > 1){
                    Notification.warning("更新失败: 镜像未找到");
                }
                promise = $timeout($scope.isDeploy, 10000);
            }else if($scope.isDeployState === IS_DEPLOYED){
                $state.reload();
            }
        }, undefined, null, function(data) {

        });
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.contentCurPage = $scope.versions.slice(($scope.currentPage - 1) * $scope.pageLength, $scope.currentPage * $scope.pageLength);
    };

    $scope.getAppInfoPromise.then($scope.getImageVersions);

    $scope.$on('$destroy', function () {
        $timeout.cancel(promise);
    });
}