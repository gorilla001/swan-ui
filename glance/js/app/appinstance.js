/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appInstanceCtrl", appInstanceCtrl);

appInstanceCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp','Notification'];

function appInstanceCtrl($scope, $rootScope, $stateParams, glanceHttp, Notification) {
    $rootScope.appTabFlag = "appInstance";
    $scope.appstate = {
        '1': "运行中",
        '2': "部署中"
    };
    
    initInstances();
    $scope.$on('refreshAppData', function() {
        initInstances(false);
    });

    function initInstances(loading) {
        glanceHttp.ajaxGet(['app.instances',{app_id: $stateParams.appId}], function (data) {
            $scope.instances = hideStartTime(data.data);
        }, undefined, null, function(data) {
            Notification.error('获取实例失败: ' + $scope.addCode[data.code]);
        }, loading)

    }

    function hideStartTime(instances) {
        var hideTime = "0001-01-01T00:00:00Z";
        var startTime;
        for (var i = 0; i < instances.length; i++) {
            startTime = instances[i].startTime;
            instances[i].hideStartTime = (startTime === hideTime);
        }
        return instances;
    }

}