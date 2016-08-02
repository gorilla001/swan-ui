(function () {
    'use strict';
    angular.module('glance.user')
        .controller('UpdatePasswordCtrl', UpdatePasswordCtrl);

    /* @ngInject */
    function UpdatePasswordCtrl($scope, Notification, gHttp, $state){
        
        var self = this;
        self.form = {
            old_password: '',
            new_password: '',
            new_password_compare: ''
        };

        self.modifyPassword = function(){
            gHttp.Resource("auth.password").put(self.form, {form: $scope.staticForm}).then(function () {
                $state.reload(true)
                Notification.success('密码修改成功！');
                self.form = {
                    old_password: '',
                    new_password: '',
                    new_password_compare: ''
                };
            });
        }
    }
})();