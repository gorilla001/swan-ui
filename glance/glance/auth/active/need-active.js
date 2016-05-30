(function (argument) {
    'use strict';

    angular.module('glance.auth')
      .controller('NeedActiveCtrl', NeedActiveCtrl);

    /* @ngInject */
    function NeedActiveCtrl($stateParams, $scope, authBackend, $state, emailUtil) {
        var self = this;
        
        self.email = $stateParams.email;
        self.emailHref = emailUtil.getEmailUrl(self.email);;
        self.resendActiveMail = resendActiveMail;
        
        function resendActiveMail() {
            return authBackend.sendActiveMail(self.email, $scope.staticForm)
                .then(function () {
                    $state.go('auth.sendActiveMailSuccess', {email: self.email});
                });
        };
    }
})();