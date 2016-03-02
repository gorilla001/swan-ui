MESSAGE_CODE = {
    success:0,
    dataInvalid:10001
};

APP_CODE = {
    100: "应用名称冲突",
    101: "端口冲突",
    102: "版本冲突",
    103: "应用被锁定",
    104: "撤销失败，应用扩展已完成",
    105: "更新已完成,",
    106: "环境变量命名不合法",
    999: "网络异常"
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
    uninstalling: "uninstalling",
    pulling: "pulling"
};

BACKEND_URL = {
    auth: {
        auth: "api/v3/auth",
        user: "api/v3/user",
        customerservice: "api/v3/customerservice_url",
        password: 'api/v3/user/password',
        notice: 'api/v3/notice'
        },
        
    cluster:  {
        clusters: "api/v3/clusters",
        versions: "api/v3/clusters/versions",
        cluster: "api/v3/clusters/$cluster_id",
        nodeId: "api/v3/clusters/$cluster_id/new_node_identifier",
        nodes: "api/v3/clusters/$cluster_id/nodes",
        node: "api/v3/clusters/$cluster_id/nodes/$node_id",
        nodeMonitor: "api/v3/clusters/$cluster_id/nodes/$node_id/metrics",
        service: "api/v3/clusters/$cluster_id/nodes/$node_id/services/$service_name",
        
        labels: "api/v3/labels",
        nodesLabels: "api/v3/clusters/$cluster_id/nodes/labels"
    },
    metrics: {
        getClusterMonitor: "api/v1/metrics/cluster/$cluster_id",
        appmonit:"api/v1/metrics/cluster/$clusterID/app/$aliase"
    },
    ws: {
        subscribe: "streaming/glance/$token"
    },
    log: {
        search: "es/index",
        downloadSearch: "es/index/download",
        searchContext: "es/context",
        downloadContext: "es/context/download"
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
        getNodePorts: "api/v1/applications/$clusterId/get-appnodes-port?cluster_id=$cluster_id&app_aliase=$app_aliase",
        event: "api/v1/applications/$app_id/events?page=$page",
        ports: "api/v1/applications/$cluster_id/ports",
        getAppsStatus: "api/v1/applications/0/appStatus",
        getVersionConfig:"api/v1/applications/$app_versionId/version-config",
        deleteVersion:"api/v1/applications/$app_versionId/version-delete",
        resend: "api/v1/applications/$app_id/redeploy"
    }
        
};
