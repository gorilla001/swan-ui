(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    function LoginCtrl($state, $stateParams, $scope, authCurd, commonBackend) {
        var self = this;
        self.form = {};
        activate();

        self.login = login;
        self.admin;
        
        function activate() {
            setNotice();
            $("[data-toggle='popover']").popover();
            if (IS_OFF_LINE) {
                self.admin = '管理员';
            } else {
                self.admin = '客服info@shurenyun.com'
            }
        }
        
        function setNotice() {
            commonBackend.getNotice()
            .then(function(data) {
                if (data) {
                    self.notice = data.content;
                }
            });
        }
        
        function login() {
            if ($scope.staticForm.$valid) {
                var returnTo = $stateParams.return_to;
                authCurd.login(self.form, $scope.staticForm, returnTo)
                .catch(function (res) {
                    if (res.code === MESSAGE_CODE.needActive) {
                        $state.go('auth.needActive', {email: self.form.email});
                    }
                })
            }
        };
    }
})();