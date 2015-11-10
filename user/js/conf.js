CONFIG = {
  urls: {
    baseUrl: "DASHBOARD/api/v1/",
    redirectUrl: "DASHBOARD/",
    loginUrl: 'auth/sign_in',
    registerUrl: 'auth/registration',
    domainUrl: "BODY_DOMAIN",
    resetPasswordUrl: "auth/password/resetrequest",
    verifyMailAddress: "auth/password/reset/$reset_code",
    activeUrl: "auth/active/$active_code"
  }
};
