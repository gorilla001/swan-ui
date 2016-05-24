(function () {
    'use strict';

    angular.module('glance.auth').factory('loginService', loginService);

    loginService.$inject = ['authBackend', '$cookies', '$window'];

    function loginService(authBackend, $cookies, $window) {

        return {
            login: login
        };

        //////////

        function login(userData, returnTo, form) {
            if (!returnTo) {
                returnTo = CONFIG.dashboard+"?timestamp="+new Date().getTime();
            }
            return authBackend.login(userData, form).then(function (data) {
                var token = '\"' + data.token + '\"';
                $cookies.put('token', token, {domain: CONFIG.domain});
                redirect4Login(returnTo, data.token);
            });
        };
        
        function redirect4Login(returnTo, token) {
            if (returnTo.indexOf('support.dataman-inc') > 0) {
                authBackend.getCustomerServiceLoginUrl(token, returnTo).then(function (data) {
                    $window.location.href = data.url;
                });
            } else {
                $window.location.href = returnTo;
            }
        }

    }
})();