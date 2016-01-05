/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appVersionCtrl", appVersionCtrl);

appVersionCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout', 'Notification', '$state', 'appCurd'];

function appVersionCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification, $state, appCurd) {
    $rootScope.appTabFlag = "appVersion";

    var urlParam = $stateParams.flag;
    var getImageVersionsFlag = false;
    var cycPromise;
    var IS_NOT_DEPLOYED = 0;
    var IS_DEPLOYED = 1;
    var DEPLOYED_ABNORMAL = 2;

    $scope.counter = 0;

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
                Notification.success('取消部署成功');
            }
        }, undefined, null, function (data) {
            Notification.error('取消部署失败');
        });
    };

    $scope.verisonDeploy = function (versionId) {
        glanceHttp.ajaxGet(['app.versionDeploy', {app_versionId: versionId}], function (data) {
            $scope.getImageVersions().then(function (res) {
                $scope.isDeploy($stateParams.appId, function () {
                    $scope.getImageVersions()
                })
            });
        }, undefined, null, function (data) {
            Notification.error('部署失败: ' + $scope.addCode[data.code]);
        })
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.contentCurPage = $scope.versions.slice(($scope.currentPage - 1) * $scope.pageLength, $scope.currentPage * $scope.pageLength);
    };

    $scope.isDeploy = function () {
        glanceHttp.ajaxGet(['app.isdeploying', {app_id: $stateParams.appId}], function (data) {
            $scope.isDeployState = data.data.isdeploying;
            console.log($scope.isDeployState);
            switch ($scope.isDeployState) {
                case IS_NOT_DEPLOYED:
                    $scope.counter += 1;
                    if (data.data.info !== "" && $scope.counter > 1) {
                        Notification.warning("更新失败");
                    }
                    cycPromise = $timeout(function () {
                        $scope.isDeploy()
                    }, 10000);
                    break;
                case IS_DEPLOYED:
                    $scope.counter = 0;
                    $scope.getImageVersions();
                    break;
                case DEPLOYED_ABNORMAL:
                    Notification.warning("1111");
                    break;
                default :
            }

            if (!getImageVersionsFlag) {
                $scope.getImageVersions();
            }
        }, undefined, null, function (data) {
            Notification.error($scope.addCode[data.code]);
        });
    };

    $scope.getAppInfoPromise.then(function(){
        if(urlParam){
            $scope.isDeploy();
        }else {
            $scope.getImageVersions();
        }
    });

    $scope.$on("$destroy",function(){
        $timeout.cancel(cycPromise)
    })

}