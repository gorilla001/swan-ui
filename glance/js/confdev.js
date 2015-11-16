BACKEND_URL = {
    defaultBase: {
        url: "DASHBOARD/",
        isSSL: false
    },
    auth: {
        logout: "api/v1/auth/sign_out",
        getMe: "api/v1/auth/getme",
        getCSUrl: "api/v1/auth/getcsurl",
        createInvitationCodes: "api/v1/auth/invitation_code/$num",
        listUsers: "api/v1/auth/user/list",
        modifyPassword: 'api/v1/auth/password/update'
        },
        
    cluster:  {
        clusterIns: "api/v2/cluster/$cluster_id",
        cluster: "api/v2/cluster",
        clusters: "api/v2/clusters",
        nodeIns: "api/v2/cluster/$cluster_id/node/$node_id",
        node: "api/v2/cluster/$cluster_id/node",
        nodes: "api/v2/cluster/$cluster_id/nodes",
        nodeId: "api/v2/cluster/$cluster_id/node/identifier",
        nodeMonitor: "api/v2/cluster/$cluster_id/node/$node_id/metrics"
    },
    metrics: {
        base: 'DASHBOARD/api/v1/',
        getClusterMonitor: "metrics/cluster/$cluster_id",
        event:"event/$clusterID/$appName",
        appmonit:"appmetrics/cluster/$clusterID/app/$appName"
    },
    ws: {
        base: "STREAMING/",
        subscribe: "streaming/glance/$token"
    },
    log: {
        base: "DASHBOARD/",
        search: "logstash-$userId-*/_search"
    },
    app: {
        base: "DASHBOARD/api/v1/",
        list: "applications/",
        deploy: "applications/deploy",
        instances: "applications/$app_id/instances",
        info: "applications/$app_id",
        config: "applications/$app_id/config",
        upContainerNum:"applications/update-container-num",
        deleteApp:"applications/$app_id/delete",
        stop:"applications/$app_id/stop",
        start:"applications/$app_id/start",
        options:"applications/$cluster_id/options",
        imageVersions:"applications/$app_id/image-versions",
        versionDeploy:"applications/$app_versionId/version-deploy",
        updateVersion:"applications/update-version",
        isdeploying: "applications/$app_id/isdeploying",
        cancelDeploy: "applications/$app_id/cancel-deployment"
    },

    userUrl: "MARKET",

    agentConfig: {
      installScript: "curl -Ls INSTALLSCRIPT_URL | sudo -H",
      dmHost: "DM_HOST",
      filesUrl: "FILES_URL"
    }
};