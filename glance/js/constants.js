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

APP_STATUS = {
    'undefined': "加载中",
    '1': "部署中",
    '2': "运行中",
    '3': "已停止",
    '4': "停止中 ",
    '5': "删除中",
    '6': "扩展中",
    '7': "启动中",
    '8': "撤销中",
    '9': "失联",
    '10': "异常"
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

LOG = {
    logDownloadToplimit: 5000
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
        userApps: 'api/v3/apps',
        clusterApps: 'api/v3/clusters/$cluster_id/apps',
        clusterApp: 'api/v3/clusters/$cluster_id/apps/$app_id',
        appEvent: 'api/v3/clusters/$cluster_id/apps/$app_id/events',
        appVersions: 'api/v3/clusters/$cluster_id/apps/$app_id/versions',
        appVersion: 'api/v3/clusters/$cluster_id/apps/$app_id/versions/$version_id',
        getAppsStatus: "api/v3/apps/status"
    }
        
};
