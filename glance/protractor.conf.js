exports.config = {
  directConnect: true,
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumAddress: 'http://localhost:4444/wd/hub/',
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.48.2.jar',
  baseUrl: 'http://localhost:8000/',
  framework: 'jasmine',
  specs: ['test/e2e/**/*.e2e.spec.js'],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose : true,
    includeStackTrace : true
  }
};