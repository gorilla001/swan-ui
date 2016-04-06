/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('GroupAppsCtrl', GroupAppsCtrl);

    /* @ngInject */
    function GroupAppsCtrl(ngTableParams, clusters, groups, $rootScope, $timeout, $scope, appcurd, appservice) {
        var self = this;
        var listAppPromise;
        var appListReloadInterval = 5000;

        $rootScope.groupAppListParams.searchKeyWord = "";
        
        self.clusterNameMap = listClusterMap(clusters);

        self.clusters = [];
        self.groups = [];
        self.applist = [];
        self.showNothtingAlert = false;     //应用列表空标记
        self.APP_STATUS = APP_STATUS;
        self.searchForm = {
                groupId: $rootScope.groupAppListParams.groupId,
                clusterId: $rootScope.groupAppListParams.clusterId
        };
        
        self.isFirstLoad = true;

        self.appListTable = new ngTableParams($rootScope.groupAppListParams, {
                counts: [20, 50, 100], // custom page count
                total: 0,
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {

                    angular.extend($rootScope.groupAppListParams, self.appListTable.parameters())
                    if ($rootScope.groupAppListParams.clusterId){
                        var loading = "";
                        if (self.isFirstLoad) {
                            loading = undefined;
                        }
                        appservice.listClusterApps(dealParams(params.url()), $rootScope.groupAppListParams.clusterId, loading)
                        .then(function (data) {
                            //If you remove when the current application of only one application,
                            //set new Page and Switch back page
                            if (!data.App.length && $rootScope.groupAppListParams.page > 1) {
                                $rootScope.groupAppListParams.page = $rootScope.groupAppListParams.page - 1
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
                            appservice.listAppsStatus({cid: $rootScope.groupAppListParams.clusterId}).then(function (data) {
                                self.appListStatus = data;
                            }, function (res) {
                                
                            });
                            
                            self.isFirstLoad = false;
                            
                            reloadTable();
                            
                        }, function (res) {
                            
                        });
                    }
                }
            }
        );

        self.search = search;
        self.groupChange = groupChange;

        activate()
        
        function activate() {
            angular.forEach(groups.groups, function (group) {
                if (group.role.id === 1) {
                    self.groups.push(group);
                }
            });
            if (self.searchForm.groupId) {
                groupChange();
            }
            $scope.$on('$destroy', function () {
                self.isDestroy = true;
                $timeout.cancel(listAppPromise);
            });
        }


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
        
        function groupChange() {
            self.clusters = [];
            angular.forEach(clusters, function (cluster) {
                if (cluster.group_id === self.searchForm.groupId) {
                    self.clusters.push(cluster);
                }
            })
        }
        
        function search() {
            self.appListTable.parameters({searchKeyWord: self.searchForm.keywords, clusterId: self.searchForm.clusterId,
                groupId: self.searchForm.groupId});
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