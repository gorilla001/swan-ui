(function () {
    'use strict';
    angular.module('glance.user')
        .controller('UpdatePasswordCtrl', UpdatePasswordCtrl);

    UpdatePasswordCtrl.$inject = ['$rootScope', '$scope', 'gHttp'];

    function UpdatePasswordCtrl($rootScope, $scope, gHttp){
        
        self = this;
        $rootScope.show = '';
        $rootScope.userTabFlag = 'password';
        self.form = {
            old_password: '',
            new_password: '',
            new_password_compare: ''
        };

        self.modifyPassword = function(){
            gHttp.Resource("auth.password").put(self.form, {"form": $scope.staticForm}).then(function () {
                alert('密码修改成功！');
                $window.history.back();
            });
        }

        self.goBack = function() {
            $window.history.back();
        }
    }
})();