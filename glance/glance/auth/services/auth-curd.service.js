(function () {
    'use strict';

    angular.module('glance.auth').factory('authCurd', authCurd);

    /* ngInject */
    function authCurd(authBackend, commonBackend, $cookies, $window) {

        return {
            login: login
        };

        //////////

        function login(userData, returnTo, form) {
            if (!returnTo) {
                returnTo = "/index.html?timestamp="+new Date().getTime();
            }
            return authBackend.login(userData, form).then(function (data) {
                var token = '\"' + data.token + '\"';
                $cookies.put('token', token, {domain: CONFIG.domain});
                redirect4Login(returnTo, data.token);
            });
        };
        
        function redirect4Login(returnTo, token) {
            if (returnTo.indexOf('support.dataman-inc') > 0) {
                commonBackend.getCSUrl(returnTo).then(function (data) {
                    $window.location.href = data.url;
                });
            } else {
                $window.location.href = returnTo;
            }
        }

    }
})();