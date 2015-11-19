/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appVersionCtrl", appVersionCtrl);

appVersionCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout','Notification'];

function appVersionCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification) {
    $rootScope.appTabFlag = "appVersion";

    $scope.getImageVersions = function(){
        glanceHttp.ajaxGet(['app.imageVersions',{app_id: $stateParams.appId}], function (data) {
            if (data && data.data && data.data.length !== 0) {
                $scope.versions = data.data;
                $scope.totalItems = $scope.versions.length;
                $scope.pageLength = 10;
                $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;
                $scope.contentCurPage = $scope.versions.slice(0, $scope.pageLength);
            }
        }, undefined, null, function(data) {
            Notification.error('获取镜像列表失败: ' + data.errors);
        })
    };

    $scope.cancelDeploy = function(){
        glanceHttp.ajaxGet(['app.cancelDeploy',{app_id: $stateParams.appId}], function (data) {
            if(data.code == 0){
                $scope.getImageVersions();
                $scope.timepick = 0;
                Notification.success('取消部署成功');
            }
        }, undefined, null, function(data) {
            Notification.error('取消部署失败');
        });
    };

    $scope.verisonDeploy = function(versionId){
        glanceHttp.ajaxGet(['app.versionDeploy',{app_versionId: versionId}], function (data) {
            $scope.getImageVersions();
        }, undefined, null, function(data) {
            Notification.error('部署失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.contentCurPage = $scope.versions.slice(($scope.currentPage - 1) * $scope.pageLength,$scope.currentPage * $scope.pageLength);
    };

    $scope.getAppInfoPromise.then($scope.getImageVersions);

}