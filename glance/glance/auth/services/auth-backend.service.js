(function () {
    'use strict';

    angular.module('glance.auth').factory('authBackend', authBackend);

    /* @ngInject */
    function authBackend(gHttp) {

        return {
            register: register,
            active: active,
            resetPassword: resetPassword,
            login: login,
            forgotPassword: forgotPassword,
            sendNewPassword: sendNewPassword,
            sendActiveMail: sendActiveMail,
        };

        //////////

        function register(params, form) {
            return gHttp.Resource('user.register').post(params, {'form': form});
        }

        function active(activeCode) {
            return gHttp.Resource('user.active', {active_code: activeCode}).put();
        }

        function resetPassword(resetCode) {
            return gHttp.Resource('user.resetPassword', {reset_code: resetCode}).get();
        }

        function login(params, form) {
            return gHttp.Resource('user.login').post(params, {'form': form});
        }

        function forgotPassword(params, form) {
            return gHttp.Resource('user.forgotPassword').post(params, {'form': form});
        }

        function sendNewPassword(resetCode, params) {
            return webHttp.Resource('user.resetPassword', {reset_code: resetCode}).put(params);
        }
        function sendActiveMail(email) {
            return webHttp.Resource('user.sendActiveMail').post({email: email});
        }

    }
})();