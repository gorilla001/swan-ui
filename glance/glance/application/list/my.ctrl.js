(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MyAppsCtrl', MyAppsCtrl);

    /* @ngInject */
    function MyAppsCtrl(ngTableParams, clusters, $rootScope, $timeout, $scope, appcurd, appservice) {
        var self = this;
        var listAppPromise;
        var appListReloadInterval = 5000;

        $rootScope.myAppListParams.searchKeyWord = "";

        self.clusterNameMap = listClusterMap(clusters);
        self.applist = [];
        self.showNothtingAlert = false;     //应用列表空标记
        
        self.isFirstLoad = true;

        self.appListTable = new ngTableParams($rootScope.myAppListParams, {
                counts: [20, 50, 100], // custom page count
                total: 0,
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {

                    $rootScope.myAppListParams = self.appListTable.parameters();
                    var loading = "";
                    if (self.isFirstLoad) {
                        loading = undefined;
                    }
                    appservice.listApps(dealParams(params.url()), loading)
                        .then(function (data) {
                            //If you remove when the current application of only one application,
                            //set new Page and Switch back page
                            if (!data.App.length && $rootScope.myAppListParams.page > 1) {
                                $rootScope.myAppListParams.page = $rootScope.myAppListParams.page - 1
                            }
                            var total = data.Count;
                            self.applist = data.App;
                            //Check whether show the warning dialog
                            if (!self.applist.length) {
                                self.showNothtingAlert = true;
                            } else {
                                self.showNothtingAlert = false;
                            }
                            params.total(total);
                            if (total > 0) {
                                $defer.resolve(data.App);
                            }

                            //ajax get getAppsStatus
                            appservice.listAppsStatus().then(function (data) {
                                self.appListStatus = data;
                            }, function (res) {

                            });
                            
                            self.isFirstLoad = false;
                            
                            reloadTable();

                        }, function (res) {

                        });
                }
            }
        );

        self.doSearch = function (searchKey) {
            $rootScope.myAppListParams.searchKeyWord = searchKey;
            self.appListTable.parameters({searchKeyWord: $rootScope.myAppListParams.searchKeyWord});
        };

        $scope.$on('$destroy', function () {
            self.isDestroy = true;
            $timeout.cancel(listAppPromise);
        });


        /*
         修改 ngTable 默认的 params.url() 为数人云标准格式
         */
        function dealParams(urlParams) {
            var data = {};
            for (var key in urlParams) {
                var temp = key;

                if (key === 'count') {
                    temp = 'per_page';
                }

                if (key.includes('sorting')) {
                    temp = 'order';
                    data['sort_by'] = key.slice(8, -1)
                }

                if (key === 'searchKeyWord') {
                    temp = 'keywords';
                }
                data[temp] = urlParams[key]
            }
            return data;
        }

        /*
         刷新
         */
        function reloadTable() {
            // every 5 seconds reload app list to refresh app list
            if (!self.isDestroy) {
                $timeout.cancel(listAppPromise);

                listAppPromise = $timeout(function () {
                    self.appListTable.reload()
                }, appListReloadInterval);
            }
        }

        /*
         获取集群名
         */
        function listClusterMap(clusters) {
            var clusterNameMap = {};
            angular.forEach(clusters, function (cluster) {
                clusterNameMap[cluster.id] = cluster.name;
            });
            return clusterNameMap
        }
    }
})();