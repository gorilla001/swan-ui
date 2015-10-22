/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appEventCtrl", appEventCtrl);

appEventCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appEventCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appEvent";

    $scope.events = [];

    $scope.appEvent = function () {
        glanceHttp.ajaxGet(['metrics.event',{clusterID: $scope.appInfo.clusterId ,appName: $scope.appInfo.name}], function (data) {
            $scope.events = data.data;
        });
    };

    $scope.$watch('appInfo', function(newValue, oldValue){
        if (newValue) {
            $scope.appEvent();
        }
    });
}