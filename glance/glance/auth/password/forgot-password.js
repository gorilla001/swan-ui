/**
 * Created by my9074 on 16/2/23.
 */
(function (argument) {
    'use strict';

    angular.module('glance.auth')
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

    /* @ngInject */
    function ForgotPasswordCtrl(authBackend, $state, $scope) {
        var self = this;
        self.sendEmail = sendEmail;

        function sendEmail () {
            $scope.staticForm.email.$setDirty();
            if ($scope.staticForm.$valid) {
                authBackend.forgotPassword(self.forgot, $scope.staticForm).then(function (data) {
                    $state.go('auth.forgotSuccess',{email:self.forgot.email});
                });
            }
        }

    }
})();