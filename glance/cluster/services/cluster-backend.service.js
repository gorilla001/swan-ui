(function () {
    'use strict';
    angular.module('glance.cluster')
        .factory('clusterBackendService', clusterBackendService);

    clusterBackendService.$inject = ['Notification', 'gHttp'];

    function clusterBackendService(Notification, gHttp) {
        return {
            listClusters: listClusters
        };

        ////////////

        function listClusters() {
            return gHttp.Resource('cluster.clusters').get();
        }

    }
})();