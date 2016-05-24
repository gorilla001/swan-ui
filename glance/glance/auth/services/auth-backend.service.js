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
            return gHttp.Resource('auth.active', {active_code: activeCode}).put();
        }

        function resetPassword(resetCode) {
            return gHttp.Resource('user.resetPassword', {reset_code: resetCode}).get();
        }

        function login(data, form) {
            return gHttp.Resource('auth.auth').post(data, {form: form});
        }

        function forgotPassword(params, form) {
            return gHttp.Resource('user.forgotPassword').post(params, {'form': form});
        }

        function sendNewPassword(resetCode, params) {
            return webHttp.Resource('user.resetPassword', {reset_code: resetCode}).put(params);
        }
        function sendActiveMail(email, form) {
            return gHttp.Resource('auth.sendActiveMail').post({email: email}, {form: form});
        }

    }
})();