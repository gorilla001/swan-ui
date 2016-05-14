(function () {
    'use strict';
    angular.module('glance.dashboard')
        .factory('dashboardBackend', dashboardBackend);


    /* @ngInject */
    function dashboardBackend(gHttp) {
        return {
            listAllClusters: listAllClusters
        };

        function listAllClusters() {
            return gHttp.Resource('cluster.clusters').get();
        }
    }
})();