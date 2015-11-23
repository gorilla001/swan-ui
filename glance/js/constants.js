MESSAGE_CODE = {
    success:0,
    dataInvalid:1,
    tokenInvalid:2,
    notLogin:3,
    noPermission:4
};

SUB_INFOTYPE = {
    nodeStatus: "NodeStatus",
    nodeMetric: "NodeMetric"
};

NODE_STATUS = {
    running: "running",
    terminated: "terminated",
    failed: "failed",
    installing: "installing"
};

CLUSTER_STATUS = {
    running: 'running',
    installing: 'installing',
    abnormal: 'abnormal',
    unknow: 'unknow'
};

WS_CODE = {
    token_invalide: 4051
};

SERVICES_STATUS = {
    running: 'running',
    installing: 'installing',
    failed: 'failed',
    uninstalled: 'uninstalled'
};

BACKEND_URL = {
    auth: {
        logout: "api/v1/auth/sign_out",
        getMe: "api/v1/auth/getme",
        getCSUrl: "api/v1/auth/getcsurl",
        createInvitationCodes: "api/v1/auth/invitation_code/$num",
        listUsers: "api/v1/auth/user/list",
        modifyPassword: 'api/v1/auth/password/update'
        },
        
    cluster:  {
        getNodeID: "api/v1/cluster/$cluster_id/new_node_id",
        node: "api/v1/cluster/$cluster_id/node",
        updateNode: "api/v1/cluster/node/update",
        getNode: "api/v1/cluster/node/$node_id",
        createCluster: "api/v1/cluster/add",
        updateCluster: "api/v1/cluster/update",
        listClusters: "api/v1/cluster/list",
        getCluster: "api/v1/cluster/$cluster_id",
        delCluster: "api/v1/cluster/$cluster_id/del",
        listNodes: "api/v1/cluster/$cluster_id/nodes/$page_num",
        delNodes: "api/v1/cluster/node/del",
        getNodeMonitor: "api/v1/cluster/node/$node_id/metrics"
    },
    metrics: {
        getClusterMonitor: "api/v1/metrics/cluster/$cluster_id",
        event:"api/v1/event/$clusterID/$appName",
        appmonit:"api/v1/appmetrics/cluster/$clusterID/app/$appName"
    },
    ws: {
        subscribe: "streaming/glance/$token"
    },
    log: {
        search: "logstash-$userId-*/_search"
    },
    app: {
        list: "api/v1/applications/",
        deploy: "api/v1/applications/deploy",
        instances: "api/v1/applications/$app_id/instances",
        info: "api/v1/applications/$app_id",
        config: "api/v1/applications/$app_id/config",
        upContainerNum:"api/v1/applications/update-container-num",
        deleteApp:"api/v1/applications/$app_id/delete",
        stop:"api/v1/applications/$app_id/stop",
        start:"api/v1/applications/$app_id/start",
        options:"api/v1/applications/$cluster_id/options",
        imageVersions:"api/v1/applications/$app_id/image-versions",
        versionDeploy:"api/v1/applications/$app_versionId/version-deploy",
        updateVersion:"api/v1/applications/update-version",
        isdeploying: "api/v1/applications/$app_id/isdeploying",
        cancelDeploy: "api/v1/applications/$app_id/cancel-deployment",
        undoScaling: "api/v1/applications/$app_id/cancel-scaling"
    }
        
}