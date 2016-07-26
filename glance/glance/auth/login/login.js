(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    function LoginCtrl($state, $stateParams, $scope, authCurd, authBackend, commonBackend, $rootScope) {
        var self = this;
        self.form = {};
        activate();

        self.login = login;
        self.admin;
        self.showLicence = false;
        
        function activate() {
            setNotice();
            $("[data-toggle='popover']").popover();
            if (IS_OFF_LINE) {
                self.admin = '管理员';
            } else {
                self.admin = '客服info@shurenyun.com'
            }
            if (IS_LICENCE_ON) {
                getLicence();
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

        function getLicence() {
            authBackend.getLicenceInfo().then(function(data) {
                if(!data.validation) {
                    $state.go('auth.licence');
                }
            });
        }
        
        function login() {
            $scope.staticForm.username.$setDirty();
            $scope.staticForm.password.$setDirty();
            if ($scope.staticForm.$valid) {
                var returnTo = $stateParams.return_to;
                authCurd.login(self.form, $scope.staticForm, returnTo)
                    .catch(function (res) {
                        if (res.code === $rootScope.MESSAGE_CODE.needActive) {
                            $state.go('auth.needActive', {email: self.form.email});
                        } else if (res.code === $rootScope.MESSAGE_CODE.needLicence) {
                            $state.go('auth.licence');
                        }
                    })
            }
        };
    }
})();