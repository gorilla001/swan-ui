(function () {
    'use strict';
    angular.module('glance.common')
        .controller('RootCtrl', RootCtrl);

    /* @ngInject */
    function RootCtrl($rootScope, $state, glanceUser, $window, commonBackend, Notification, joinDemoGroupModal, mdSideNav) {
        var self = this;

        self.noticeNav = mdSideNav.createSideNav('noticeNav');
        self.linkToCS = linkToCS;
        self.logout = logout;
        self.goBack = goBack;
        self.openJoinDemoGroupModal = openJoinDemoGroupModal;
        self.togShortMenu = togShortMenu;
        self.isShortMenu = false;
        self.userManualUrl = "http://doc.shurenyun.com";
        self.noticeHtml = null;

        $rootScope.IS_OFF_FLAG = IS_OFF_LINE;
        $rootScope.FRONTEND_MSG = FRONTEND_MSG;
        $rootScope.phoneCodeResendExpire = SMS.phoneCodeResendExpire;

        // app list request params
        $rootScope.myAppListParams = {
            searchKeyWord: '',
            page: 1,  //current page index
            count: 20, // current count
            //sorting: { name: 'asc',  appStatus:'asc', containerNum:'asc', clusterId:'asc', update:'asc'} // sorting field
        };

        $rootScope.groupAppListParams = {
            searchKeyWord: '',
            page: 1,  //current page index
            count: 20, // current count
            clusterId: null,
            groupId: null
        };

        $rootScope.groupListParams = {
            page: 1,
            count: 20
        };

        // image list request params
        $rootScope.imageListParams = {
            page: 1,  //current page index
            count: 20, // current count
        };

        activate();

        function activate() {
            getNotice();
            firstLogin();

            //check offLine/onLine
            if (IS_OFF_LINE) {
                self.userManualUrl = "http://offlinedoc.shurenyun.com/";
            } else {
                self.userManualUrl = "http://doc.shurenyun.com";
            }
        }

        function linkToCS() {
            var w = window.open();
            commonBackend.getCSUrl().then(function (data) {
                w.location = data.url;
            });
        }

        function logout() {
            commonBackend.logout().then(function (data) {
                glanceUser.clear();
                window.location.href = USER_URL + "/?timestamp=" + new Date().getTime();
            });
        }

        function joinDemoGroupModalSuccess() {
            $rootScope.notInDemoGroup = false;
            $state.go('user.groups', null, {reload: true});
            Notification.success("申请试用成功");
        }

        function goBack() {
            $window.history.back();
        }

        function getNotice() {
            commonBackend.getNotice()
                .then(function (data) {
                    if (data) {
                        self.noticeHtml = data.content;
                    }
                })
                .catch(function () {
                    console.log("Notice ajax error");
                })
        }

        function firstLogin() {
            if ($rootScope.isFirstLogin && $rootScope.demoGroupId) {
                openJoinDemoGroupModal();
                $rootScope.isFirstLogin = false;
            }
        }

        function openJoinDemoGroupModal() {
            if ($rootScope.isPhoneVerified) {
                commonBackend.joinDemoGroup()
                    .then(function () {
                        joinDemoGroupModalSuccess();
                    });
            } else {
                joinDemoGroupModal.open().then(function (res) {
                    joinDemoGroupModalSuccess();
                    $rootScope.isPhoneVerified = true;
                });
            }
        }

        function togShortMenu() {
            self.isShortMenu = !self.isShortMenu;
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                switch (true) {
                    case toState.name.startsWith('app'):
                        $rootScope.show = 'application';
                        break;
                    case toState.name.startsWith('image'):
                        $rootScope.show = 'image';
                        break;
                    case toState.name.startsWith('log'):
                        $rootScope.show = 'log';
                        break;
                    case toState.name.startsWith('home'):
                        $rootScope.show = 'home';
                        break;
                    case toState.name.startsWith('cluster'):
                        $rootScope.show = 'cluster';
                        break;
                    case toState.name.startsWith('repository'):
                        $rootScope.show = 'repository';
                        break;
                    case toState.name.startsWith('policy'):
                        $rootScope.show = 'policy';
                        switch (true) {
                            case toState.name.includes('appwarning'):
                                $rootScope.tabActiveFlag = 'appwarning';
                                switch (true) {
                                    case toState.name.includes('warninglist'):
                                        $rootScope.tabContentPolicy = 'warninglist';
                                        break;
                                    case toState.name.includes('warningevent'):
                                        $rootScope.tabContentPolicy = 'warningevent';
                                        break;
                                }
                                break;
                            case toState.name.includes('apptimescaling'):
                                $rootScope.tabActiveFlag = 'apptimescaling';
                                switch (true) {
                                    case toState.name.includes('scalinglist'):
                                        $rootScope.tabContentPolicy = 'scalinglist';
                                        break;
                                    case toState.name.includes('scalingevent'):
                                        $rootScope.tabContentPolicy = 'scalingevent';
                                        break;
                                }
                                break;
                            case toState.name.includes('applogwarning'):
                                $rootScope.tabActiveFlag = 'applogwarning';
                                switch (true) {
                                    case toState.name.includes('loglist'):
                                        $rootScope.tabContentPolicy = 'loglist';
                                        break;
                                    case toState.name.includes('logevent'):
                                        $rootScope.tabContentPolicy = 'logevent';
                                        break;
                                }
                                break;
                        }
                        break;
                }
            });

        $rootScope.$watch('isFirstLogin', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                firstLogin();
            }
        });
    }
})();