/*
 * 后台各个服务的地址（含协议，网络地址，端口）.
 * defaultBase为默认地址，如果某个服务的配置为null，则使用它作为后台地址.
 * ws是指websocket.
 */
BACKEND_URL_BASE = {
    defaultBase: "APIURL/",
    ws: "STREAMING/",
    auth: null,
    cluster: null,
    metrics: null,
    log: null,
    app: null,
    image: null,
    warning: null,
    billing: null,
    stack: null
},

//部署模式，可选dev，demo，prod.
RUNNING_ENV = "ENVIRONMENT"; //dev, demo, prod

//webpage地址（含协议，网络地址，端口）.
USER_URL = "MARKET";

//是否为线下环境
IS_OFF_LINE = OFFLINE;  //set true or false

//线下环境图片路径
OFF_LINE_IMAGE_URL = "IMAGE_BASE_URL";

/*
 * agent的配置
 * dmHost为streaming的地址（含协议，网络地址，端口）.
 * installUrl为agent的安装脚本路径
 */
AGENT_CONFIG = {
    dmHost: "LOCAL_DM_HOST",
    installUrl: "AGENT_URL"
};

/*
 * group：共享集群中的应用，映射端口使用的地址
 * demo：demo用户的应用，映射端口使用的地址
 */
APP_CONFIG_SPE_URL = {
    group: "GROUP_URL",
    demo: "DEMO_URL"
};

//demo用户的邮箱地址
DEMO_EMAIL = "DEMO_USER";

//共享用户权限的域（保存cookies用）。
DOMAIN = 'BODY_DOMAIN';

(function() {
  if (RUNNING_ENV === 'dev' && AGENT_CONFIG.dmHost.slice(0, 5) === "LOCAL") {
    AGENT_CONFIG.dmHost = 'DM_HOST=ws://devstreaming.dataman-inc.net/';
  } else if (RUNNING_ENV === 'demo') {
    AGENT_CONFIG.dmHost = 'DM_HOST=ws://demostreaming.dataman-inc.net/';
  } else if (RUNNING_ENV === 'prod') {
    AGENT_CONFIG.dmHost = '';
  }
  
  if (!AGENT_CONFIG.installUrl || AGENT_CONFIG.installUrl.slice(0, 5) === 'AGENT') {
      AGENT_CONFIG.installUrl = "https://coding.net/u/upccup/p/dm-agent-installer/git/raw/master/install-agent.sh";
  }
})();

// licence是否开启
IS_LICENCE_ON = LICENCEON; //set true or false;
