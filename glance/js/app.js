var glanceApp = angular.module('glance',
    [
        'ngCookies',
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ngSocket',
        'infinite-scroll',
        'ngSanitize',
        'isteven-multi-select',
        'ui.bootstrap.datetimepicker',
        'ui-notification',
        'ngTable',
        'glance.utils',
        'glance.app',
        'glance.user',
        'glance.image',
        'glance.common',
        'glance.repository',
        'glance.policy',
        'ngMaterial',
        'glance.dashboard'
    ]);

glanceApp.config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$locationProvider','NotificationProvider',
    function ($stateProvider, $urlRouterProvider, $interpolateProvider, $locationProvider, NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            positionX: 'right',
            positionY: 'top',
            replaceMessage: true,
            startTop: 20,
            startRight: 260
        });

        $urlRouterProvider.otherwise('/dashboard/home');
        $stateProvider
            .state('log', {
                url: '/log',
                views: {
                    '': {
                        templateUrl: '/views/log/log.html',
                        controller: 'logBaseCtrl'
                    }
                }
            })
            .state('modifyPassword', {
                url: '/modifypassword',
                views: {
                    '': {
                        templateUrl: '/views/admin/modify-password.html',
                        controller: 'modifyPasswordCtrl'
                    }
                }
            })
            .state('404', {
                views: {
                    '': {
                        templateUrl: '/views/common/notFound.html'
                    }
                }
            });


        $locationProvider.html5Mode(true);

        $interpolateProvider.startSymbol('{/');
        $interpolateProvider.endSymbol('/}');
    }]);

glanceApp.run(glanceInit);

glanceInit.$inject = ['glanceUser', 'glanceHttp', '$rootScope', 'gHttp'];
function glanceInit(glanceUser, glanceHttp, $rootScope, gHttp) {
    if (IS_OFF_LINE) {
        $rootScope.HOME_URL = "/auth/login";
    } else {
        $rootScope.HOME_URL = USER_URL;
    }
    glanceUser.init();
    gHttp.Resource("auth.user").get().then(function (data) {
        $rootScope.userName = data["userName"];
        $rootScope.userId = data["userId"];
        $rootScope.isSuperuser = data["isSuperuser"];
        $rootScope.isDemo = data["isDemo"];
        $rootScope.isFirstLogin = data["isFirstLogin"];
        $rootScope.phoneNumber = data["phoneNumber"];
        // join demo group flow
        $rootScope.isPhoneVerified = data["isPhoneVerified"];
        // demo group button
        $rootScope.notInDemoGroup = !data["isInDemoGroup"];
        $rootScope.demoGroupId = data["demoGroupId"];
        //GrowingIO
        if (RUNNING_ENV === "prod") {
            (function () {
                _vds.push(['setAccountId', '0edf12ee248505950b0a77b02d47c537']);
                _vds.push(['setCS1', 'user_id', data["userId"].toString()]);
                (function () {
                    var vds = document.createElement('script');
                    vds.type = 'text/javascript';
                    vds.async = true;
                    vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(vds, s);
                })();
            })();
        }
    })
}
