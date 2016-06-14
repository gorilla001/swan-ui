/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('GroupAppsCtrl', GroupAppsCtrl);

    /* @ngInject */
    function GroupAppsCtrl(clusters, groups, status, mdTable, $stateParams, $scope, timing, $q, apps, $state, utils, appservice, userBackend) {
        var self = this;
        var appListReloadInterval = 5000;

        self.clusterNameMap = listClusterMap(clusters);
        self.table = mdTable.createTable('app.list.group');
        self.appListStatus = status;

        self.searchForm = {};
        self.clusters = [];
        self.groups = [];
        self.applist = apps.App;
        self.count = apps.Count;
        self.searchForm.keywords = $stateParams.keywords;
        self.APP_STATUS = APP_STATUS;
        self.groupUserMap = {};


        self.search = search;
        self.groupChange = groupChange;

        activate();

        function activate() {
            if($stateParams.groupId){
                getGroupIdUsers();
            }
            angular.forEach(groups.groups, function (group) {
                if (group.role.id === 1) {
                    self.groups.push(group);
                }
            });

            if ($stateParams.groupId && $stateParams.clusterId) {
                initToolbar();
                timing.start($scope, reloadApps, appListReloadInterval)

            }
        }

        function initToolbar() {
            self.searchForm.groupId = parseInt($stateParams.groupId);

            groupChange();

            self.searchForm.clusterId = parseInt($stateParams.clusterId);

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
            $state.go('app.list.group', {
                page: $stateParams.page,
                per_page: $stateParams.per_page,
                order: $stateParams.order,
                sort_by: $stateParams.sort_by,
                keywords: self.searchForm.keywords,
                clusterId: self.searchForm.clusterId,
                groupId: self.searchForm.groupId
            })
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

        function reloadApps() {
            var deferred = $q.defer();
            appservice.listClusterApps(encodeGroupAppsParams($stateParams), self.searchForm.clusterId, '')
                .then(function(data){
                    self.applist = data.App;
                    self.count = data.Count;

                    appservice.listAppsStatus({cid: self.searchForm.clusterId})
                        .then(function(data){
                            self.appListStatus = data;
                            deferred.resolve();
                        })
                });
            return deferred.promise;
        }

        function encodeGroupAppsParams($stateParams) {
            var params = utils.encodeQueryParams($stateParams);

            if (self.searchForm.clusterId) {
                params.clusterId = self.searchForm.clusterId;
            }

            if ($stateParams.groupId) {
                params.groupId = self.searchForm.groupId;
            }

            return params;
        }

        function getGroupIdUsers(){
            userBackend.listGroupUser($stateParams.groupId)
                .then(function(data){
                    if(data && data.length){
                        angular.forEach(data, function(item, index){
                            self.groupUserMap[item.user.id] = item.user.name
                        });
                    }
                })
        }
    }
})();