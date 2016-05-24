/**
 * Created by my9074 on 16/2/23.
 */
(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('LoginCtrl', LoginCtrl);

    /* @ngInject */
    function LoginCtrl(authCurd, commonBackend, $location, $scope, $state) {
        var self = this;
        self.loginData = {};
        var returnTo = $location.search()['return_to'];
        
        setNotice();

        self.login = function () {
            authCurd.login(self.loginData, returnTo, $scope.staticForm)
                .then(function () {
                    
                }, function (res) {
                    if (res.code === MESSAGE_CODE.needActive) {
                        $state.get('needActive').data.email = self.loginData.email;
                        $state.go('needActive');
                    }
                })
        };
        
        $("[data-toggle='popover']").popover();
        
        function setNotice() {
            commonBackend.getNotice()
            .then(function(data) {
                if (data) {
                    self.notice = data.content;
                }
            });
        }
    }
})();