(function () {
    'use strict';
    angular.module('glance.utils')
        .run(Constant);

    /* @ngInject */
    function Constant($rootScope) {
        $rootScope.BACKEND_URL = {
            app: {
                userApps: 'items',
                clusterApps: 'api/v3/clusters/$cluster_id/apps',
                clusterAllApps: "api/v3/clusters/$cluster_id/allapps",
                clusterApp: 'api/v3/clusters/$cluster_id/apps/$app_id',
                appEvent: 'api/v3/clusters/$cluster_id/apps/$app_id/events',
                appVersions: 'api/v3/clusters/$cluster_id/apps/$app_id/versions',
                appDebug: 'api/v3/clusters/$cluster_id/apps/$app_id/debug',
                hasDeploymentIds: 'api/v3/clusters/$cluster_id/apps/$app_id/hasDeploymentIds',
                appVersion: 'api/v3/clusters/$cluster_id/apps/$app_id/versions/$version_id',
                appsStatus: "api/v3/apps/status",
                appStatus: "api/v3/clusters/$cluster_id/apps/$app_id/status",
                appTask: "api/v3/clusters/$cluster_id/apps/$app_id/tasks",
                ports: "api/v3/clusters/$cluster_id/ports",
                logPaths: "api/v3/clusters/$cluster_id/apps/$app_id/logpaths",
                appNodes: "api/v3/clusters/$cluster_id/apps/$app_id/appnodes",
                scale: 'api/v3/clusters/$cluster_id/apps/$app_id/scale',
                crons: 'api/v3/crons',
                cron: 'api/v3/crons/$scale_id',
                scaleDetail: 'api/v3/clusters/$cluster_id/apps/$app_id/scale/$scale_id',
                changeWeight: 'api/v3/clusters/$cluster_id/apps/$app_id/weight',
                taskappExtend: 'api/v3/scales',
                canary: "api/v3/clusters/$cluster_id/apps/$app_id/canary/$version_id",
                canarys: "api/v3/clusters/$cluster_id/apps/$app_id/canary",
                canaryStatus: "api/v3/clusters/$cluster_id/apps/$app_id/canary/status"
            },
        };
    }
})();
