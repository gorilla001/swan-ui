(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('ForgotPasswordSuccessCtrl', ForgotPasswordSuccessCtrl);

    /* @ngInject */
    function ForgotPasswordSuccessCtrl($state, $stateParams, emailUtil) {
        var self = this;
        self.email = $stateParams.email;
        self.emailHref = emailUtil.getEmailUrl(self.email);
    }
})();
