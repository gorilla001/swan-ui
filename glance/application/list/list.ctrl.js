/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('ListAppCtrl', ListAppCtrl);

    ListAppCtrl.$inject = ['ngTableParams', 'listClusters', '$rootScope', '$timeout', '$scope', 'appcurd', 'appservice'];

    function ListAppCtrl(ngTableParams, listClusters, $rootScope, $timeout, $scope, appcurd, appservice) {
        var self = this;
        var listAppPromise;
        var appListReloadInterval = 5000;

        $rootScope.appListParams.searchKeyWord = "";

        self.clusterNameMap = listClusterMap(listClusters);
        self.applist = [];
        self.showNothtingAlert = false;     //应用列表空标记
        self.APP_STATUS = APP_STATUS;
        
        self.isFirstLoad = true;

        self.appListTable = new ngTableParams($rootScope.appListParams, {
                counts: [20, 50, 100], // custom page count
                total: 0,
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {

                    $rootScope.appListParams = self.appListTable.parameters();
                    var loading = "";
                    if (self.isFirstLoad) {
                        loading = undefined;
                    }
                    appservice.listApps(dealParams(params.url()), loading)
                        .then(function (data) {
                            //If you remove when the current application of only one application,
                            //set new Page and Switch back page
                            if (!data.App.length && $rootScope.appListParams.page > 1) {
                                $rootScope.appListParams.page = $rootScope.appListParams.page - 1
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
            $rootScope.appListParams.searchKeyWord = searchKey;
            self.appListTable.parameters({searchKeyWord: $rootScope.appListParams.searchKeyWord});
        };

        /*
           停止操作
         */
        self.stop = function (clusterId, appId) {
            var data = {};
            appcurd.stop(data, clusterId, appId)
        };

        /*
           启动操作
         */
        self.start = function (clusterId, appId) {
            var data = {};
            appcurd.start(data, clusterId, appId)
        };

        /*
           恢复操作
         */
        self.undo = function (clusterId, appId) {
            var data = {};
            appcurd.undo(data, clusterId, appId)
        };

        /*
           删除操作
         */
        self.delete = function (clusterId, appId) {
            appcurd.del(clusterId, appId);
        };

        /*
           重新部署操作
         */
        self.redeploy = function (clusterId, appId) {
            var data = {};
            appcurd.redeploy(data, clusterId, appId)
        };

        self.upContainerModal = function (clusterId, appId, instanceNum) {
            appcurd.updateContainer(instanceNum, clusterId, appId);
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