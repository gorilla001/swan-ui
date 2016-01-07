/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appEventCtrl", appEventCtrl);

appEventCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appEventCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appEvent";

    $scope.events = [];
    $scope.currentTypeText = {
        ScaleApplication: "应用扩展操作",
        StartApplication: "应用部署操作",
        StopApplication: "应用停止操作",
        TASK_RUNNING: "实例正在运行",
        TASK_FINISHED: "实例运行成功",
        TASK_FAILED: "实例启动失败",
        TASK_KILLED: "实例已被杀死",
        TASK_STAGING: "实例启动中",
        TASK_LOST: "实例已经丢失",
        StartApp: "应用启动",
        StopApp: "应用停止",
        DeployApp: "应用部署",
        UpdateApp: "应用更新",
        UpdateAppNum: "应用扩展",
        CancelScale: "取消应用扩展",
        CancelDeployment: "取消应用部署",
        RestartApplication: "应用重启"
    };
    $scope.eventTypeText = {
        status_update_event: "实例状态更新",
        deployment_success: "部署成功",
        deployment_failed: "部署失败",
        deployment_step_success: "部署操作成功",
        deployment_step_failure: "部署操作失败",
        AppOperation: "应用操作"
    };

    $scope.appEvent = function () {
        getEvents(1)
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function(currentPage) {
        getEvents(currentPage)
    };

    function getEvents(page){
        glanceHttp.ajaxGet(['app.event',{app_id: $stateParams.appId, page: page}], function (data) {
            if(data.data){
                $scope.events = data.data.Message;

                $scope.totalItems = data.data.Page;
                $scope.pageLength = 20;
                $scope.showPagination = ($scope.totalItems > $scope.pageLength);
            }
        });
    }

    $scope.appEvent();
}