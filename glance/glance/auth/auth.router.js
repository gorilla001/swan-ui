(function () {
    'use strict';
    angular.module('glance.auth')
        .config(configure);

    /* @ngInject */
    function configure($urlRouterProvider,
                       $stateProvider) {

        $urlRouterProvider.otherwise('/auth');

        $stateProvider
            .state('auth', {
                url: '/auth',
                template: '<ui-view/>',
                targetState: 'login'
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: '/glance/auth/register/register.html',
                controller: 'RegisterCtrl as registerCtrl'
            })
            .state('auth.registerSuccess', {
                url: '/register/success',
                templateUrl: '/glance/auth/register/register-success-notice.html'
            })
            .state('auth.active', {
                url: '/active?active',
                templateUrl: '/glance/auth/active/active.html',
                controller: 'ActiveCtrl as activeCtrl'
            })
            .state('auth.needActive', {
                url: '/active/needed?email',
                templateUrl: '/glance/auth/active/need-active.html',
                controller: 'NeedActiveCtrl as needActiveCtrl'
            })
            .state('auth.sendActiveMailSuccess', {
                url: '/active/sendmailsuccess?email',
                templateUrl: '/glance/auth/active/send-active-mail-success.html',
                controller: 'SendActiveMailSuccessCtrl as sendActiveMailSuccessCtrl'
            })
            .state('auth.login', {
                url: '/login?return_to',
                templateUrl: '/glance/auth/login/login.html',
                controller: 'LoginCtrl as loginCtrl'
            })
            .state('auth.demoLogin', {
                url: '/demoLogin',
                controller: 'DemoLoginCtrl'
            })
            .state('auth.forgotPassword', {
                url: '/forgotpassword',
                templateUrl: '/glance/auth/password/forgot-password.html',
                controller: 'ForgotPasswordCtrl as forgotPasswordCtrl'
            })
            .state('auth.forgotSuccess', {
                url: '/forgotpassword/success?email',
                templateUrl: '/glance/auth/password/forgot-success-notice.html',
                controller: 'ForgotPasswordSuccessCtrl as forgotPasswordSuccessCtrl'
            })
            .state('auth.resetPassword', {
                url: '/resetpassword?reset',
                templateUrl: '/glance/auth/password/reset-password.html',
                controller: 'ResetPasswordCtrl as resetPasswordCtrl'
            })
            .state('auth.resetPasswordSuccess', {
                url: '/resetpassword/success',
                templateUrl: '/glance/auth/password/reset-password-success.html',
            })
            .state('auth.resetPasswordFailed', {
                url: '/resetpassword/failed',
                templateUrl: '/glance/auth/password/reset-password-failed.html'
            })
            .state('auth.licence', {
                url: '/licence',
                templateUrl: '/glance/auth/licence/licence.html',
                controller: 'LicenceCtrl as licenceCtrl'
            });
    }
})();