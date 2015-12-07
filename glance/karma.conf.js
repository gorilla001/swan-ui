// Karma configuration
// Generated on Thu Dec 03 2015 10:01:10 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

     hostname: 'localhost',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'js/confdev.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/loaders.css/loaders.css.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/ngSocket/dist/ngSocket.js',
        'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'bower_components/zeroclipboard/dist/ZeroClipboard.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
        'bower_components/moment/min/moment-with-locales.min.js',
        'bower_components/circliful/js/jquery.circliful.min.js',
        'bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
        'bower_components/ng-dialog/js/ngDialog.min.js',
        'bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
        'bower_components/echarts/src/echarts-dataman.js',
        'bower_components/angularjs-slider/dist/rzslider.min.js',

        'bower_components/angular-mocks/angular-mocks.js',

        'js/app.js',
        'js/constants.js',
        'js/directives.js',
        'js/rootctrl.js',
        'js/ngservices/*.js',
        
        'js/cluster/*.js',
        'js/app/*.js',
        'js/log/*.js',
        'js/admin/*.js',
        'js/dynamic/*.js',
        'test/unit/**/*.spec.js'

    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    plugins : [
        'karma-chrome-launcher',
        'karma-jasmine'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
