(function (argument) {
    'use strict';

    angular.module('glance.auth')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    /* @ngInject */
    function ResetPasswordCtrl($location, authBackend, $state, $stateParams) {
        var self = this;
        self.sendPassword = sendPassword;
        self.valid;

        activate();

        //发送新密码

        function sendPassword() {
            authBackend.sendNewPassword($stateParams.reset, self.resetData)
                .then(function (data) {
                    $state.go('auth.resetPasswordSuccess');
                }, function (res) {
                    $state.go('auth.resetPasswordFailed');
                });
        }

        function activate() {
            return authBackend.validResetCode($stateParams.reset)
                .then(function () {
                    self.valid = true;
                }, function () {
                    self.valid = false;
                });
        }

    }
})();