(function () {
    'use strict';
    angular.module('glance.app')
        .controller('MyAppsCtrl', MyAppsCtrl);

    /* @ngInject */
    function MyAppsCtrl(clusters, apps, status, mdTable, $stateParams, $scope, timing, appservice, utils, $q) {
        var self = this;
        var appListReloadInterval = 5000;

        self.clusterNameMap = listClusterMap(clusters);
        self.table = mdTable.createTable('app.list.my');
        self.applist = apps.App;
        self.count = apps.Count;
        self.appListStatus = status;
        self.filter = $stateParams.keywords;


        activate();

        function activate() {
            timing.start($scope, reloadApps, appListReloadInterval)
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
            appservice.listApps(utils.encodeQueryParams($stateParams), '')
                .then(function (data) {
                    self.applist = data.App;
                    self.count = data.Count;
                    appservice.listAppsStatus()
                        .then(function (data) {
                            self.appListStatus = data;
                            deferred.resolve();
                        })
                });
            return deferred.promise;

        }
    }
})();