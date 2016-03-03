(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appservice', appservice);

    appservice.$inject = ['Notification', 'gHttp'];

    function appservice(Notification, gHttp) {
        //////
        return {
            listApps: listApps,
            listClusterApps: listClusterApps,
            createApp: createApp,
            deleteApp: deleteApp,
            getApp: getApp,
            rollbackApp: rollbackApp,
            stopApp: stopApp,
            startApp: startApp,
            updateVersion: updateVersion,
            stopDeploy: stopDeploy,
            stopScaling: stopScaling,
            reDeploy: reDeploy,
            updateContainerNum: updateContainerNum,
            modifyApp: modifyApp,
            listAppEvents: listAppEvents,
            listAppVersions: listAppVersions,
            deleteAppVersion: deleteAppVersion,
            listAppsStatus: listAppsStatus,
            getAppStatus: getAppStatus,
            listAppInstances: listAppInstances

        };

        function listApps(params, loading){
            return gHttp.Resource('app.userApps').get({params : params, "loading": loading});
        }

        function listClusterApps(params, clusterId){
            return gHttp.Resource('app.clusterApps', {cluster_id: clusterId}).get({params : params});
        }

        function createApp(data, clusterId){
            return gHttp.Resource('app.clusterApps', {cluster_id: clusterId}).post(data);
        }

        function deleteApp(clusterId, appId){
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).delete();
        }

        function getApp(clusterId, appId, loading){
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).get({'loading': loading});
        }

        function rollbackApp(data, clusterId, appId){
            data.method = 'rollback';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopApp(data, clusterId, appId){
            data.method = 'stop';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function startApp(data, clusterId, appId){
            data.method = 'start';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function updateVersion(data, clusterId, appId){
            data.method = 'update_version';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopDeploy(data, clusterId, appId){
            data.method = 'stop_deploy';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopScaling(data, clusterId, appId){
            data.method = 'stop_scaling';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function reDeploy(data, clusterId, appId){
            data.method = 'redeploy';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function updateContainerNum(data, clusterId, appId){
            data.method = 'scale';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function modifyApp(data, clusterId, appId){
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).put(data);
        }

        function listAppEvents(params, clusterId, appId){
            return gHttp.Resource('app.appEvent', {cluster_id: clusterId, app_id: appId}).get({params: params});
        }

        function listAppVersions(params, clusterId, appId){
            return gHttp.Resource('app.appVersions', {cluster_id: clusterId, app_id: appId}).get({params: params});
        }

        function deleteAppVersion(clusterId, appId, versionId){
            return gHttp.Resource('app.appVersion', {cluster_id: clusterId, app_id: appId, version_id: versionId}).delete();
        }

        function listAppsStatus(){
            return gHttp.Resource('app.appsStatus').get({"loading": ""});
        }

        function getAppStatus(cluserId, appId, loading){
            return gHttp.Resource('app.appStatus', {cluster_id: cluserId, app_id: appId}).get({'loading': loading});
        }
        
        function listAppInstances(cluserId, appId, loading){
            return gHttp.Resource('app.appTask', {cluster_id: cluserId, app_id: appId}).get({'loading': loading});
        }


    }
})();