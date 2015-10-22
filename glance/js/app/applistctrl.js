/**
 * Created by myu on 15-8-13.
 */
glanceApp.controller("appListCtrl", appListCtrl);

appListCtrl.$inject = ['$scope', 'glanceHttp'];

function appListCtrl($scope, glanceHttp) {
    $scope.listApp = function () {
        glanceHttp.ajaxGet(['app.list'], function (data) {
            $scope.applist = [];
            if (data && data.data && data.data.length !== 0) {
                $scope.applist = data.data;
                $scope.totalItems = $scope.applist.length;
                $scope.pageLength = 10;
                $scope.showPagination = ($scope.totalItems > $scope.pageLength)? true: false;
                $scope.contentCurPage = $scope.applist.slice(0, $scope.pageLength);
            }
        });
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.contentCurPage = $scope.applist.slice(($scope.currentPage - 1) * $scope.pageLength,$scope.currentPage * $scope.pageLength);
    };

    $scope.listApp();
}