(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('SendActiveMailSuccessCtrl', SendActiveMailSuccessCtrl);

    SendActiveMailSuccessCtrl.$inject = ['$state', 'emailService'];

    function SendActiveMailSuccessCtrl($state, emailService) {
        var self = this;

        self.emailHref = emailService.emailUrl($state.current.data.email);
    }
})();