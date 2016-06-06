(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('LicenceCtrl', LicenceCtrl);

    /* @ngInject */
    function LicenceCtrl($state, $stateParams, $rootScope, $scope, authBackend, commonBackend) {
        var self = this;
        self.licence = '';
        activate();

        self.validate = validate;

        function activate() {
            setNotice();
            $("[data-toggle='popover']").popover();
            if (IS_OFF_LINE) {
                self.admin = '管理员';
            } else {
                self.admin = '客服info@shurenyun.com'
            }
        }
        
        function setNotice() {
            commonBackend.getNotice()
            .then(function(data) {
                if (data) {
                    self.notice = data.content;
                }
            });
        }
        
        function validate() {
            authBackend.validateLicence(self.licence).then(function(data){
                $state.go('auth.login');
            });
        };
    }
})();