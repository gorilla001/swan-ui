/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appInstanceCtrl", appInstanceCtrl);

appInstanceCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp', '$timeout'];

function appInstanceCtrl($scope, $rootScope, $stateParams, glanceHttp, $timeout) {
    $rootScope.appTabFlag = "appInstance";
    $scope.appstate = {
        '1': "运行中",
        '2': "部署中"
    };

    var promise;
    (function appInstances() {
        glanceHttp.ajaxGet(['app.instances',{app_id: $stateParams.appId}], function (data) {
            $scope.instances = data.data;
            if(!data.data.length) {
                promise = $timeout(appInstances, 2000);
            }
        }, undefined, null, function(data) {
            alert("获取实例失败" + data.errors);
        })
    })();

    $scope.$on('$destroy', function(){
        $timeout.cancel(promise);
    });

}