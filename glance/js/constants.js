MESSAGE_CODE = {
    success:0,
    dataInvalid:1,
    tokenInvalid:2,
    notLogin:3,
    noPermission:4
};

SUB_INFOTYPE = {
    nodeStatus: "NodeStatus",
    nodeMetric: "NodeMetric",
    serviceStatus: "ServiceStatus",
    agentUpgradeFailed: "AgentUpgradeFailed"
};

NODE_STATUS = {
    running: "running",
    terminated: "terminated",
    failed: "failed",
    installing: "installing",
    initing: "initing",
    upgrading: "upgrading",
    uninstalling: "uninstalling"
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
    uninstalled: 'uninstalled',
    uninstalling: "uninstalling"
};

BACKEND_URL = {
    auth: {
        auth: "api/v2/auth",
        user: "api/v2/user",
        customerservice: "api/v2/customerservice",
        password: 'api/v2/user/password'
        },
        
    cluster:  {
        nodeId: "api/v2/cluster/$cluster_id/node/identifier",
        node: "api/v2/cluster/$cluster_id/node",
        nodeIns: "api/v2/cluster/$cluster_id/node/$node_id",
        cluster: "api/v2/cluster",
        clusterIns: "api/v2/cluster/$cluster_id",
        clusters: "api/v2/clusters",
        nodes: "api/v2/cluster/$cluster_id/nodes",
        nodeMonitor: "api/v2/cluster/$cluster_id/node/$node_id/metrics",
        serviceStatus: "api/v2/cluster/$cluster_id/node/$node_id/service/$service_name/status",
        label: "api/v2/label",
        nodeLabel: "api/v2/cluster/$cluster_id/node/$node_id/labels",
        nodeLabelList: "api/v2/cluster/$cluster_id/nodeslabels"
    },
    metrics: {
        getClusterMonitor: "api/v1/metrics/cluster/$cluster_id",
        appmonit:"api/v1/metrics/cluster/$clusterID/app/$appName"
    },
    ws: {
        subscribe: "streaming/glance/$token"
    },
    log: {
        search: "logstash-$userId-*/_search"
    },
    app: {
        list: "api/v1/applications/",
        allList:"api/v1/applications/",
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
        undoScaling: "api/v1/applications/$app_id/cancel-scaling",
        getNodes: "api/v1/applications/$clusterId/get-appnodes?cluster_id=$cluster_id&app_name=$app_name",
        getNodePorts: "api/v1/applications/$clusterId/get-appnodes-port?cluster_id=$cluster_id&app_name=$app_name",
        event: "api/v1/applications/$app_id/events?page=$page",
        ports: "api/v1/applications/$cluster_id/ports",
        getAppsStatus: "api/v1/applications/0/appStatus"
    }
        
};
