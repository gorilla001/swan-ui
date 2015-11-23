CONFIG = {
  environment:"ENVIRONMENT", //dev, demo, prod
  urls: {
    baseUrl: "DASHBOARD/api/v1/",
    redirectUrl: "DASHBOARD/",
    loginUrl: 'auth/sign_in',
    registerUrl: 'auth/registration',
    domainUrl: "BODY_DOMAIN",
    resetPasswordUrl: "auth/password/resetrequest",
    verifyMailAddress: "auth/password/reset/$reset_code",
    activeUrl: "auth/active/$active_code",
    activeMailUrl: "auth/active",
    _versionBaseUrl: "MARKET" + "/version/",
    versionUrl: {
      agent: "omega-agent",
      app: "omega-app",
      cluster: "omega-cluster",
      frontend: "omega-frontend",
      metrics: "omega-metrics"
    }
  }
};
