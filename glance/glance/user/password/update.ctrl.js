(function () {
    'use strict';
    angular.module('glance.user')
        .controller('UpdatePasswordCtrl', UpdatePasswordCtrl);

    /* @ngInject */
    function UpdatePasswordCtrl($scope, Notification, gHttp){
        
        var self = this;
        self.form = {
            old_password: '',
            new_password: '',
            new_password_compare: ''
        };

        self.modifyPassword = function(){
            gHttp.Resource("auth.password").put(self.form).then(function () {
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