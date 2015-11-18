BACKEND_URL = {
    auth: {
        base: "DASHBOARD/api/v1/",
        logout: "auth/sign_out",
        getMe: "auth/getme",
        getCSUrl: "auth/getcsurl",
        createInvitationCodes: "auth/invitation_code/$num",
        listUsers: "auth/user/list",
        modifyPassword: 'auth/password/update'
        },
        
    cluster:  {
        base: "DASHBOARD/api/v1/",
        getNodeID: "cluster/$cluster_id/new_node_id",
        node: "cluster/$cluster_id/node",
        updateNode: "cluster/node/update",
        getNode: "cluster/node/$node_id",
        createCluster: "cluster/add",
        updateCluster: "cluster/update",
        listClusters: "cluster/list",
        getCluster: "cluster/$cluster_id",
        delCluster: "cluster/$cluster_id/del",
        listNodes: "cluster/$cluster_id/nodes/$page_num",
        delNodes: "cluster/node/del",
        getNodeMonitor: "cluster/node/$node_id/metrics"
    },
    metrics: {
        base: 'DASHBOARD/api/v1/',
        getClusterMonitor: "metrics/cluster/$cluster_id",
        event:"event/$clusterID/$appName",
        appmonit:"appmetrics/cluster/$clusterID/app/$appName"
    },
    ws: {
        base: "STREAMING/streaming/",
        subscribe: "glance/$token"
    },
    log: {
        base: "DASHBOARD/",
        search: "logstash-$userId-*/_search"
    },
    service: {
        base: "DASHBOARD/api/v1/",
        createServiceInstance: "services/create"
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
      version: "OMEGA_AGENT_VERSION",
      filesUrl: "FILES_URL"
    }
};