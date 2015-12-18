/**
 * Created by myu on 15-8-13.
 */

glanceApp.controller("appListCtrl", appListCtrl);

appListCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', '$timeout', 'Notification', 'ngTableParams'];

function appListCtrl($scope, $rootScope, glanceHttp, $timeout, Notification, ngTableParams) {

    var listClusterPromise = $scope.listCluster(),listAppPromise;
    var appListReloadInterval = 8000;
    //promise.then($scope.listApp);
    //// app list request params
    //$scope.appListParams = {
    //    searchKeyWord:'',
    //    page: 1,  //current page index
    //    count: 10, // current count
    //    //sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
    //};
    // app list table object
    $scope.appListTable = new ngTableParams( $rootScope.appListParams, {
            counts: [5, 10, 20], // custom page count
            total: 0,
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            getData: function ($defer, params) {
                $rootScope.appListParams = $scope.appListTable.parameters();
                glanceHttp.ajaxGet(['app.list'], function (res) {
                    var total = res.data.TotalNumber;
                    params.total(total);
                    if (total > 0) {
                        $defer.resolve(res.data.App);
                    }
                    // every 5 seconds reload app list to refresh app list
                    $timeout.cancel(listAppPromise);
                    listAppPromise = $timeout(function(){$scope.appListTable.reload()}, appListReloadInterval);

                }, params.url(),function(errorRes){

                    // on error every 5 seconds reload app list to refresh app list
                    $timeout.cancel(listAppPromise);
                    listAppPromise = $timeout(function(){$scope.appListTable.reload()}, appListReloadInterval);
                });
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
        $timeout.cancel(listClusterPromise);
        $timeout.cancel(listAppPromise);
    });

}
