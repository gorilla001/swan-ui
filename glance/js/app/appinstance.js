/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appInstanceCtrl", appInstanceCtrl);

appInstanceCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout','Notification'];

function appInstanceCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout, Notification) {
    $rootScope.appTabFlag = "appInstance";
    $scope.appstate = {
        '1': "运行中",
        '2': "部署中"
    };

    var promise;
    (function appInstances() {
        glanceHttp.ajaxGet(['app.instances',{app_id: $stateParams.appId}], function (data) {
            $scope.instances = data.data;
            if (isDeploying(data)) {
                promise = $timeout(appInstances, 3000);
            }
            $scope.getAppInfo($stateParams.appId);
        }, undefined, null, function(data) {
            Notification.error('获取实例失败: ' + data.errors);
        })
    })();

    function isDeploying(data){
        var result = false;
        if (!data.data.length) {
            result = true;
        } else {
            for (var i = 0; i < data.data.length; i++) {
                if(data.data[i].instancdStatus === 2) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(promise);
    });

}