/**
 * Created by myu on 15-8-13.
 */

glanceApp.controller("appListCtrl", appListCtrl);

appListCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', '$timeout', 'Notification', 'ngTableParams'];

function appListCtrl($scope, $rootScope, glanceHttp, $timeout, Notification, ngTableParams) {

    var listClusterPromise = $scope.listCluster(),listAppPromise;
    //promise.then($scope.listApp);
    // app list request params
    $scope.appListParams = {
        searchKeyWord:'',
    };
    // app list table object
    $scope.appListTable = new ngTableParams({
            page: 1,  //current page index
            count: 20, // current count
            sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
        }, {
            counts: [5, 10, 20], // custom page count
            total: 0,
            getData: function ($defer, params) {
                glanceHttp.ajaxGet(['app.list'], function (res) {
                    var total = res.data.TotalNumber;
                    params.total(total);
                    if (total > 0) {
                        // every 5 seconds reload app list to refresh app list
                        listAppPromise = $timeout(function(){$scope.appListTable.reload()}, 5000);
                        $defer.resolve(res.data.App);
                    }
                }, params.url());
            }
        }
    );
    ////app list params is change ,reload app list
    //$scope.$watch('appListParams',function(newValue,oldValue){
    //    $scope.appListTable.parameters(newValue);
    //});

    // do search
    $scope.doSearch= function ($event) {
        $scope.appListTable.parameters({searchKeyWord: $scope.appListParams.searchKeyWord});
    };

    //
    $scope.$on('$destroy', function () {
        $timeout.cancel(promise);
    });

}
