(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('ForgotPasswordSuccessCtrl', ForgotPasswordSuccessCtrl);

    /* @ngInject */
    function ForgotPasswordSuccessCtrl($state, emailService) {
        var self = this;

        self.email = $state.current.data.email;
        self.emailHref = emailService.emailUrl(self.email);
    }
})();
