(function () {
    'use strict';
    angular.module('glance.common')
        .controller('RootCtrl', RootCtrl);

    /* @ngInject */
    function RootCtrl($rootScope, $state, glanceUser, $window, commonBackend, Notification, joinDemoGroupModal, mdSideNav) {
        var self = this;

        $rootScope.nodeStatusCls = {};
        $rootScope.nodeStatusCls[NODE_STATUS.running] = "fa fa-heartbeat text-success";
        $rootScope.nodeStatusCls[NODE_STATUS.terminated] = "fa fa-chain-broken text-danger";
        $rootScope.nodeStatusCls[NODE_STATUS.failed] = "fa fa-bomb text-danger";
        $rootScope.nodeStatusCls[NODE_STATUS.abnormal] = "fa fa-exclamation-triangle text-warning";
        $rootScope.nodeStatusCls[NODE_STATUS.installing] = "fa fa-cog text-normal";
        $rootScope.nodeStatusCls[NODE_STATUS.initing] = "fa fa-cog text-normal";
        $rootScope.nodeStatusCls[NODE_STATUS.upgrading] = "fa fa-cog text-normal";
        $rootScope.nodeStatusCls[NODE_STATUS.repairing] = "fa fa-cog text-normal";

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

        $rootScope.$watch('isFirstLogin', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                firstLogin();
            }
        });
    }
})();