/**
 * Created by my9074 on 16/2/23.
 */
(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('RegisterCtrl', RegisterCtrl);

    /* @ngInject */
    function RegisterCtrl(authBackend, $state, $scope) {
        var self = this;
        self.register = register;
        
        function register() {
            authBackend.register(self.registerForm, $scope.staticForm).then(function (data) {
                $state.go('auth.registerSuccess');
            });
        }
    }
})();