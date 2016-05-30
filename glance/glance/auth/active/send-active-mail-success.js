(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('SendActiveMailSuccessCtrl', SendActiveMailSuccessCtrl);

    /* @ngInject */
    function SendActiveMailSuccessCtrl($stateParams, emailUtil) {
        var self = this;

        self.emailHref = emailUtil.getEmailUrl($stateParams.email);
    }
})();