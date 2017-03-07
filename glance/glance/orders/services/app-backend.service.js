(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appservice', appservice);

    appservice.$inject = ['Notification', 'gHttp'];

    function appservice(Notification, gHttp) {
        //////
        return {
            listApps: listApps,
            createApp: createApp,
            updateApp: updateApp,
            deleteApp: deleteApp,
            getApp: getApp,
        };
        function listApps(params, loading) {
            return gHttp.Resource('app.userApps').get({params: params, "loading": loading});
        }

        function createApp(data, clusterId, form) {
            return gHttp.Resource('app.clusterApps', {cluster_id: clusterId}).post(data, {form: form});
        }

        function updateApp(data, clusterId, appId, form) {
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).put(data, {form: form});
        }

        function deleteApp(clusterId, appId) {
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).delete();
        }

        function getApp(clusterId, appId, loading) {
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).get({'loading': loading});
        }

    }
})();
