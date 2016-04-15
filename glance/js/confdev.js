BACKEND_URL_BASE = {
    defaultBase: "APIURL/",
    ws: "STREAMING/",
    auth: null,
    cluster: null,
    metrics: null,
    log: null,
    app: null,
    image: null
},

RUNNING_ENV = "ENVIRONMENT"; //dev, demo, prod

USER_URL = "MARKET";

IS_OFF_LINE = OFFLINE;  //set true or false

AGENT_CONFIG = {
    dmHost: "LOCAL_DM_HOST",
    installUrl: "AGENT_URL"
};

GRAFANA_CONFIG = {
    baseUrl: "GF_BASE_URL",
};

APP_CONFIG_SPE_URL = {
    group: "GROUP_URL",
    demo: "DEMO_URL"
};

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
