MESSAGE_CODE = {
    success: 0,
    dataInvalid: 10001,
    noExist: 10009
};

CODE_MESSAGE = {
    10000: "服务器忙",
    10001: "数据错误",
    10009: "资源不存在",
    10010: "您没有权限进行此操作",
    11005: "非激活用户",
    11006: "已加入用户组",
    11007: "该用户组有其它用户存在或有集群存在",
    11008: "没有验证手机号",
    11009: "已发送，请等待",
    11010: "验证码错误",
    14003: "应用名称冲突",
    14004: "应用端口冲突",
    14005: "应用版本冲突",
    14006: "应用被锁定",
    14007: "应用扩展失败",
    14008: "应用更新已完成，回滚失败",
    14009: "环境变量命名错误",
    14011: "请求错误",
    15001: "数据库操作错误",
    15008: "project 不存在",
    15009: "image 不存在",
    15012: "构建错误",
    15021: "仓库地址不合法"
};

WS_CODE = {
        token_invalide: 4051
};

FRONTEND_MSG = {
    no_group_admin: "对不起，您不是用户组管理员，不能进行此操作!"
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

APP_INS_STATUS = {
    '1': "运行中",
    '2': "部署中"
};

IMAGE_STATUS = {
    'pending': "等待中",
    'running': "执行中",
    'success': "成功",
    'skipped': "已忽略",
    'failure': "失败",
    'killed': "已停止",
    'error': "失败"
};

APP_EVENTS_MSG = {
    ScaleApplication: "应用扩展操作",
    StartApplication: "应用部署操作",
    StopApplication: "应用停止操作",
    TASK_RUNNING: "实例正在运行",
    TASK_FINISHED: "实例运行成功",
    TASK_FAILED: "实例启动失败",
    TASK_KILLED: "实例已被杀死",
    TASK_STAGING: "实例启动中",
    TASK_LOST: "实例已经丢失",
    StartApp: "应用启动",
    StopApp: "应用停止",
    DeployApp: "应用部署",
    UpdateApp: "应用更新",
    UpdateAppNum: "应用扩展",
    CancelScale: "取消应用扩展",
    CancelDeployment: "取消应用部署",
    RestartApplication: "应用重启",
    Redeploy: "应用重新部署",
    PullImageError: "镜像拉取失败",
    UnknownError: "未知错误",
    SlaveRemoved: "主机节点已被删除",
    DockerRunError: "Docker 启动错误"
};

IMAGE_TRIGGER_TYPE = {
    SELECT_TAG: 1,
    SELECT_BRANCH: 2,
    SELECT_ALL: 3
};

APP_EVENTS_TYPE = {
    status_update_event: "实例状态更新",
    deployment_success: "部署成功",
    deployment_failed: "部署失败",
    deployment_step_success: "部署操作成功",
    deployment_step_failure: "部署操作失败",
    AppOperation: "应用操作",
    FailureMessage: "部署失败消息"
};

APP_PROTOCOL_TYPE = {
    "1": "TCP",
    "2": "HTTP"
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

SMS = {
    phoneCodeResendExpire: 60
};

BACKEND_URL = {
    auth: {
        auth: "api/v3/auth",
        user: "api/v3/user",
        customerservice: "api/v3/customerservice_url",
        password: 'api/v3/user/password',
        notice: 'api/v3/notice',
        phoneCode: 'api/v3/auth/phone/code',
        verifyPhone: 'api/v3/auth/phone/verification'
    },

    cluster: {
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
        getClusterMonitor: "api/v3/clusters/$cluster_id/metrics",
        appmonit: "api/v3/clusters/$clusterID/apps/$aliase/metrics"
    },
    ws: {
        subscribe: "streaming/glance/$token"
    },
    log: {
        search: "es/index",
        downloadSearch: "es/download/index/log",
        searchContext: "es/context",
        downloadContext: "es/download/context/log"
    },
    app: {
        userApps: 'api/v3/apps',
        clusterApps: 'api/v3/clusters/$cluster_id/apps',
        clusterAllApps: "api/v3/clusters/$cluster_id/allapps",
        clusterApp: 'api/v3/clusters/$cluster_id/apps/$app_id',
        appEvent: 'api/v3/clusters/$cluster_id/apps/$app_id/events',
        appVersions: 'api/v3/clusters/$cluster_id/apps/$app_id/versions',
        appVersion: 'api/v3/clusters/$cluster_id/apps/$app_id/versions/$version_id',
        appsStatus: "api/v3/apps/status",
        appStatus: "api/v3/clusters/$cluster_id/apps/$app_id/status",
        appTask: "api/v3/clusters/$cluster_id/apps/$app_id/tasks",
        ports: "api/v3/clusters/$cluster_id/ports",
        logPaths: "api/v3/clusters/$cluster_id/apps/$app_id/logpaths",
        appNodes: "api/v3/clusters/$cluster_id/apps/$app_id/appnodes"
    },
    user: {
        groups: 'api/v3/groups',
        group: 'api/v3/groups/$group_id',
        groupMemberships: 'api/v3/groups/$group_id/memberships',
        groupMyMemberships: 'api/v3/groups/$group_id/mymemberships',
        groupDemo: 'api/v3/groups/demo/mymemberships'
    },
    
    image: {
        projects: 'api/v3/projects',
        project: 'api/v3/projects/$project_id',
        projectImages: 'api/v3/projects/$project_id/builds',
        projectApps: 'api/v3/projects/$project_id/apps',
        deleteImage: 'api/v3/projects/$project_id/images/$image_id',
        imageLog: 'api/v3/projects/$project_id/builds/$build_number/1/logs',
        manualBuild: 'api/v3/projects/$project_id/hook',
        streamLog: 'api/v3/projects/$project_id/builds/$build_number/1/stream'
    },

    repo: {
        repositories: 'api/v3/repositories',
        repository: 'api/v3/repositories/$project_name/$repository_name',
        repositoryTags: 'api/v3/repositories/$project_name/$repository_name/tags',
        repositoryCategories: 'api/v3/repositories/categories',
        deployRepo: 'api/v3/repositories/$project_name/$repository_name/apps'
    }
};
