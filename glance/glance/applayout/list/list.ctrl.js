(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutListCtrl', LayoutListCtrl);


    /* @ngInject */
    function LayoutListCtrl(mdTable, data, layoutBackend, clusters) {
        var self = this;

        self.stacks = data.Stacks;
        self.clusterNameMap = listClusterMap(clusters);
        self.openFlag = {};
        self.tableList = {};
        self.showTableData = showTableData;

        function showTableData(stackId, clusterId) {
            if (!self.openFlag[stackId]) {
                layoutBackend.listStackApps(stackId, clusterId).
                    then(function(data){
                     console.log(data.applications);
                     self.tableList[stackId] = data.applications;
                })
            } else {
                self.openFlag[stackId] = false;
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

        ///
    }
})();