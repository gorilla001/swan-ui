/**
 * Created by myu on 15-8-13.
 */

glanceApp.controller("appListCtrl", appListCtrl);

appListCtrl.$inject = ['$scope', '$rootScope', 'glanceHttp', '$timeout', 'Notification', 'ngTableParams'];

function appListCtrl($scope, $rootScope, glanceHttp, $timeout, Notification, ngTableParams) {

    var listAppPromise;
    var appListReloadInterval = 5000;
    var NEED_NAMEMAP = true;

    $scope.listCluster(NEED_NAMEMAP);
    $scope.applist = [];
    $rootScope.appListParams.searchKeyWord = "";
    // app list table object
    $scope.appListTable = new ngTableParams($rootScope.appListParams, {
            counts: [10, 20, 50], // custom page count
            total: 0,
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,
            getData: function ($defer, params) {
                $rootScope.appListParams = $scope.appListTable.parameters();
                glanceHttp.ajaxGet(['app.list'], function (res) {
                    //If you remove when the current application of only one application,
                    //set new Page and Switch back page
                    if (!res.data.App.length && $rootScope.appListParams.page > 1) {
                        $rootScope.appListParams.page = $rootScope.appListParams.page - 1
                    }
                    var total = res.data.TotalNumber;
                    $scope.applist = res.data.App;
                    params.total(total);
                    if (total > 0) {
                        $defer.resolve(res.data.App);
                    }

                    //ajax get getAppsStatus
                    glanceHttp.ajaxGet(['app.getAppsStatus'], function (res) {
                        $scope.appListStatus = res.data;
                    }, undefined, undefined, undefined, false);

                    reloadTable();
                }, params.url(), function (errorRes) {

                    reloadTable();
                }, function(res) {
                    Notification.error($scope.addCode[data.code]);
                }, false)
            }
        }
    );

    function reloadTable(){
        // every 5 seconds reload app list to refresh app list
        if (!$scope.isDestroy){
            $timeout.cancel(listAppPromise);
            
            listAppPromise = $timeout(function () {
                $scope.appListTable.reload()
            }, appListReloadInterval);
        }
    }

    ////app list params is change ,reload app list
    //$scope.$watch('appListParams',function(newValue,oldValue){
    //    $scope.appListTable.parameters(newValue);
    //});

    // do search
    $scope.doSearch = function (searchKey) {
        $rootScope.appListParams.searchKeyWord = searchKey;
        $scope.appListTable.parameters({searchKeyWord: $rootScope.appListParams.searchKeyWord});
    };

    //
    $scope.$on('$destroy', function () {
        $scope.isDestroy = true;
        $timeout.cancel(listAppPromise);
    });

}
