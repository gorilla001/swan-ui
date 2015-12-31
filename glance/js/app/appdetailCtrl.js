glanceApp.controller("appdetailCtrl", appdetailCtrl);

appdetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'glanceHttp', 'ngDialog', '$timeout', 'Notification', '$q'];

function appdetailCtrl($scope, $state, $stateParams, glanceHttp, ngDialog, $timeout, Notification, $q) {

    $scope.getAppInfo = function (appId) {
        var deferred = $q.defer();
        glanceHttp.ajaxGet(['app.info', {app_id: appId}], function (data) {
            $scope.appInfo = data.data;

            $scope.configObject = {
                "clusterId": $scope.appInfo.clusterId,
                "appId": parseInt($scope.appInfo.appId),
                "appName": $scope.appInfo.name
            };
            deferred.resolve();
        }, null, null, function(data){
            Notification.error($scope.addCode[data.code]);
        });
        return deferred.promise;
    };

    $scope.getAppInfoPromise = $scope.getAppInfo($stateParams.appId);
}