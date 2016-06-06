(function () {
    'use strict';

    angular.module('glance.auth').factory('authBackend', authBackend);

    /* @ngInject */
    function authBackend(gHttp) {

        return {
            register: register,
            active: active,
            validResetCode: validResetCode,
            login: login,
            forgotPassword: forgotPassword,
            sendNewPassword: sendNewPassword,
            sendActiveMail: sendActiveMail,
            getLicenceInfo: getLicenceInfo,
            validateLicence: validateLicence
        };

        //////////

        function register(data, form) {
            return gHttp.Resource('auth.register').post(data, {'form': form});
        }

        function active(activeCode) {
            return gHttp.Resource('auth.active', {active_code: activeCode}).put();
        }

        function validResetCode(resetCode) {
            return gHttp.Resource('auth.resetPassword', {reset_code: resetCode}).get();
        }

        function login(data, form) {
            return gHttp.Resource('auth.auth').post(data, {form: form});
        }

        function forgotPassword(data, form) {
            return gHttp.Resource('auth.forgotPassword').post(data, {'form': form});
        }

        function sendNewPassword(resetCode, data) {
            return gHttp.Resource('auth.resetPassword', {reset_code: resetCode}).put(data);
        }

        function sendActiveMail(email, form) {
            return gHttp.Resource('auth.sendActiveMail').post({email: email}, {form: form});

        }

        function getLicenceInfo() {
            return gHttp.Resource('licence.licence').get();
        }

        function validateLicence(content) {
            return gHttp.Resource('licence.licence').post({content: content});
        }
    }
})();