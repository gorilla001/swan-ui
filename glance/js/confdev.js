BACKEND_URL = {
    auth: {
        base: "https://DASHBOARD/api/v1/",
        logout: "auth/sign_out",
        getMe: "auth/getme",
        getCSUrl: "auth/getcsurl",
        createInvitationCodes: "auth/invitation_code/$num",
        listUsers: "auth/user/list"
        },
        
    cluster:  {
        base: "https://DASHBOARD/api/v1/",
        getNodeID: "cluster/$cluster_id/new_node_id",
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
        base: 'https://DASHBOARD/api/v1/',
        getClusterMonitor: "metrics/cluster/$cluster_id",
        event:"event/$clusterID/$appName",
        appmonit:"appmetrics/cluster/$clusterID/app/$appName"
    },
    ws: {
        base: "wss://DASHBOARD/streaming/",
        subscribe: "glance/$token"
    },
    log: {
        base: "https://DASHBOARD/",
        search: "logstash-$userId-*/_search"
    },
    service: {
        base: "https://DASHBOARD/api/v1/",
        createServiceInstance: "services/create"
    },
    app: {
        base: "https://DASHBOARD/api/v1/",
        list: "applications/",
        deploy: "applications/deploy",
        instances: "applications/$app_id/instances",
        info: "applications/$app_id",
        config: "applications/$app_id/config",
        upContainerNum:"applications/update-container-num",
        deleteApp:"applications/$app_id/delete",
        stop:"applications/$app_id/stop",
        start:"applications/$app_id/start",
        options:"applications/$cluster_id/options"
    },

    userUrl: "https://MARKET",

    agentConfig: {
      dm_host: "",
      files_url: ""
    }
};

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
