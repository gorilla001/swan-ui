glanceApp.controller("appdetailCtrl", appdetailCtrl);

appdetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'gHttp', '$timeout', 'Notification', 'appObj'];

function appdetailCtrl($scope, $state, $stateParams, gHttp, $timeout, Notification, appObj) {

    $scope.appInfo = appObj;
    $scope.configObject = {
        "clusterId": $scope.appInfo.clusterId,
        "appId": parseInt($scope.appInfo.appId),
        "appName": $scope.appInfo.name,
        "aliase": $scope.appInfo.aliase
    };
    
    var timeoutPromise = $timeout(refreshData, 5000);
    
    function refreshData(){
        if (!$scope.isDestroy){
            gHttp.Resource('app.info', {app_id: $stateParams.appId}).get({loading: ''}).then(
                    function(data) {
                        $scope.appInfo = data;
                        timeoutPromise = $timeout(refreshData, 5000);
                    }
            ).catch(function() {
                timeoutPromise = $timeout(refreshData, 5000);
            });
            $scope.$broadcast('refreshAppData');
        }
    }
    
    $scope.$on('$destroy', function () {
        $scope.isDestroy = true;
        $timeout.cancel(timeoutPromise);
    });
}