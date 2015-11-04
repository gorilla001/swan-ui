/**
 * Created by myu on 15-8-13.
 */
glanceApp.controller("appListCtrl", appListCtrl);

appListCtrl.$inject = ['$scope', 'glanceHttp','$timeout', 'Notification'];

function appListCtrl($scope, glanceHttp, $timeout, Notification) {

    var promise;
    $scope.deleteStopApps = {};

    $scope.listApp = function () {
        glanceHttp.ajaxGet(['app.list'], function (data) {
            if (data.data) {
                $scope.applist = data.data;
                getAppName($scope.applist);
                $scope.deleteStopApps = getDeleteStopApps(data.data);
                if (isNeedCall($scope.deleteStopApps)) {
                    promise = $timeout($scope.listApp, 3000);
                }
            }
            $scope.totalItems = $scope.applist.length;
            $scope.pageLength = 10;
            $scope.showPagination = Boolean($scope.totalItems > $scope.pageLength);
            $scope.contentCurPage = $scope.applist.slice(0, $scope.pageLength);
        });
    };


    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.contentCurPage = $scope.applist.slice(($scope.currentPage - 1) * $scope.pageLength,$scope.currentPage * $scope.pageLength);
    };

    $scope.listApp();

    function getAppName(apps){
        $scope.curAppNames.splice(0, $scope.curAppNames.length);
        angular.forEach(apps, function(value,index){
            $scope.curAppNames.push(value.appName);
        });
    }
    
    $scope.$on('$destroy', function(){
        $timeout.cancel(promise);
    });

    $scope.$watch('deleteStopApps', function(newValue, oldValue) {
        var diffIds = getDiffAppIds(newValue, oldValue);
        var diffApps = getDiffApps(oldValue, diffIds);
        var notificationText = {
            isDeleting: '删除成功',
            isStopping: '停止成功'
        };
        var text;
        $.each(diffApps, function(key, apps) {
            if (apps.length) {
                text = notificationText[key];
                $.each(apps, function(index, app) {
                    Notification.success('应用' + app.appName + text);
                });
            }
        });
    });


    function getDeleteStopApps(applist) {
        var deleteStopApps = {
            isDeleting: {
                apps: [],
                ids: []
            },
            isStopping: {
                apps: [],
                ids: []
            }
        };

        var codes = {
            isDeleting: 5,
            isStopping: 3
        };

        for (var i = 0; i < applist.length; i++) {
            $.each(codes, function(key, value) {
                if(applist[i].appStatus === value) {
                    deleteStopApps[key].apps.push(applist[i]);
                    deleteStopApps[key].ids.push(applist[i].appId);
                }
            });
        }
        return deleteStopApps;
    }

    function isNeedCall(deleteStopApps) {
        var needCall = false;
        for (var kind in deleteStopApps) {
            if(deleteStopApps[kind].ids.length) {
                needCall = true;
                break;
            }
        }
        return needCall;
    }

    function arrayDiff(newArray, oldArray) {
        var diffArray = [];
        diffArray = oldArray.filter(function(i) {
            return newArray.indexOf(i) === -1;
        });
        return diffArray;
    }

    function getDiffAppIds(newValue, oldValue) {
        var diffIds = {
            isDeleting: [],
            isStopping: []
        };

        $.each(diffIds, function(key, ids) {
           if(newValue[key] && oldValue[key]) {
               diffIds[key] = arrayDiff(newValue[key].ids, oldValue[key].ids);
           }
        });
        return diffIds;
    }

    function getAppById(kind, id) {
        var app;
        for(var i = 0; i < kind.apps.length; i++) {
            if(kind.apps[i].appId == id) {
                app = kind.apps[i];
                break;
            }
        }
        return app;
    }

    function getDiffApps(deleteStopApps, diffIds) {
        var diffApps = {
            isDeleting: [],
            isStopping: []
        };
        var app;
        $.each(diffIds, function(key, ids) {
            if (ids.length) {
                $.each(ids, function(index, id) {
                    app = getAppById(deleteStopApps[key], id);
                    if(app) {
                        diffApps[key].push(app);
                    }
                });
            }
        });
        return diffApps;
    }
}