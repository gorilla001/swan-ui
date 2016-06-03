(function () {
    'use strict';

    angular.module('glance.auth').factory('authCurd', authCurd);

    /* ngInject */
    function authCurd(authBackend, commonBackend, gHttp, $cookies, $window) {

        return {
            login: login
        };

        function login(data, form, returnTo) {
            if (!returnTo) {
                returnTo = "/index.html?timestamp="+new Date().getTime();
            }
            return authBackend.login(data, form).then(function (data) {
                $cookies.remove('token');
                $cookies.put('token', data.token, {domain: DOMAIN});
                redirect4Login(returnTo, data.token);
            });
        };
        
        function redirect4Login(returnTo, token) {
            if (returnTo.indexOf('support.dataman-inc') > 0) {
                gHttp.setToken(token);
                commonBackend.getCSUrl(returnTo).then(function (data) {
                    $window.location.href = data.url;
                });
            } else {
                $window.location.href = returnTo;
            }
        }

    }
})();