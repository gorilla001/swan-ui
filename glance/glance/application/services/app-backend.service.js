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
            updateApp: updateApp,
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
            listAppInstances: listAppInstances,
            listClusterAllApps: listClusterAllApps,
            listAppPorts: listAppPorts,
            listAppNodes: listAppNodes,
            getReqRate: getReqRate,
            getAppMetics: getAppMetics,
            getMonitor: getMonitor,
            createCanary: createCanary,
            deleteCanary: deleteCanary,
            updateContainerCanary: updateContainerCanary,
            changeWeight: changeWeight,
            stopCanary: stopCanary,
            startCanary: startCanary,
            listCanaryStatus: listCanaryStatus,
            listCanary: listCanary
        };

        function listApps(params, loading) {
            return gHttp.Resource('app.userApps').get({params: params, "loading": loading});
        }

        function listClusterApps(params, clusterId, loading) {
            return gHttp.Resource('app.clusterApps', {cluster_id: clusterId}).get({params: params, loading: loading});
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

        function rollbackApp(data, clusterId, appId) {
            data.method = 'rollback';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopApp(data, clusterId, appId) {
            data.method = 'stop';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function startApp(data, clusterId, appId) {
            data.method = 'start';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function updateVersion(data, clusterId, appId) {
            data.method = 'update_version';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopDeploy(data, clusterId, appId) {
            data.method = 'stop_deploy';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function stopScaling(data, clusterId, appId) {
            data.method = 'stop_scaling';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function reDeploy(data, clusterId, appId) {
            data.method = 'redeploy';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        // 扩展容器数提交
        function updateContainerNum(data, clusterId, appId) {
            data.method = 'scale';

            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).patch(data);
        }

        function modifyApp(data, clusterId, appId) {
            return gHttp.Resource('app.clusterApp', {cluster_id: clusterId, app_id: appId}).put(data);
        }

        function listAppEvents(params, clusterId, appId) {
            return gHttp.Resource('app.appEvent', {cluster_id: clusterId, app_id: appId}).get({params: params});
        }

        function listAppVersions(params, clusterId, appId, loading) {
            return gHttp.Resource('app.appVersions', {cluster_id: clusterId, app_id: appId})
                .get({params: params, 'loading': loading});
        }

        function deleteAppVersion(clusterId, appId, versionId) {
            return gHttp.Resource('app.appVersion', {
                cluster_id: clusterId,
                app_id: appId,
                version_id: versionId
            }).delete();
        }

        function listAppsStatus(params) {
            return gHttp.Resource('app.appsStatus').get({params: params, loading: ""});
        }

        function getAppStatus(cluserId, appId, loading) {
            return gHttp.Resource('app.appStatus', {cluster_id: cluserId, app_id: appId}).get({'loading': loading});
        }

        function listAppInstances(cluserId, appId, loading) {
            return gHttp.Resource('app.appTask', {cluster_id: cluserId, app_id: appId}).get({'loading': loading});
        }

        function listClusterAllApps(cluserId) {
            var params = {
                page: 1,
                per_page: 10000
            };

            return gHttp.Resource('app.clusterApps', {cluster_id: cluserId}).get({params: params});
        }

        function listAppPorts(clusterId, appId) {
            if (appId) {
                var params = {"appId": appId};
            }
            return gHttp.Resource('app.ports', {cluster_id: clusterId}).get({'params': params});
        }

        function listAppNodes(clusterId, appId, loading) {
            return gHttp.Resource('app.appNodes', {cluster_id: clusterId, app_id: appId}).get({'loading': loading, ignoreCodes: 14404});
        }

        function getReqRate(clusterId, alias) {
            return gHttp.Resource('metrics.reqRate', {cluster_id: clusterId, aliase: alias}).get();
        }

        function getAppMetics(clusterId, alias) {
            return gHttp.Resource('metrics.appmonit', {clusterID: clusterId, aliase: alias}).get({loading: ''})
        }

        function getMonitor(clusterId, alias) {
            return gHttp.Resource('metrics.monitor', {clusterID: clusterId, aliase: alias}).get({loading: ''})
        }

        function createCanary(data, clusterId, appId) {
            return gHttp.Resource('app.canarys', {cluster_id: clusterId, app_id: appId}).post(data);
        }

        function deleteCanary(clusterId, appId, versionId) {
            return gHttp.Resource('app.canary', {cluster_id: clusterId, app_id: appId, version_id: versionId}).delete();
        }

        function updateContainerCanary(data, clusterId, appId, versionId) {
            data.method = 'scale';
            return gHttp.Resource('app.canary', {cluster_id: clusterId, app_id: appId, version_id: versionId}).patch(data);
        }

        function stopCanary(data, clusterId, appId, versionId) {
            data.method = 'stop';

            return gHttp.Resource('app.canary', {cluster_id: clusterId, app_id: appId, version_id: versionId}).patch(data);
        }

        function startCanary(data, clusterId, appId, versionId) {
            data.method = 'start';

            return gHttp.Resource('app.canary', {cluster_id: clusterId, app_id: appId, version_id: versionId}).patch(data);
        }

        function listCanaryStatus(clusterId, appId) {

            return gHttp.Resource('app.canaryStatus', {cluster_id: clusterId, app_id: appId}).get();
        }

        function changeWeight(clusterId, appId, data) {
            return gHttp.Resource('app.changeWeight', {cluster_id: clusterId, app_id: appId}).post(data);
        }

        function listCanary(clusterId, appId) {

            return gHttp.Resource('app.canarys', {cluster_id: clusterId, app_id: appId}).get();
        }
    }
})();