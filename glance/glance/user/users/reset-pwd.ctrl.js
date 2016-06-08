(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ResetPwdCtrl', ResetPwdCtrl);

    /*@ngInject*/
    function ResetPwdCtrl(userBackend,
                           Notification,
                           $state,
                           $stateParams){
        var self = this;
	self.userId = $stateParams.user_id; 
	self.form = { password: "" };

	self.resetPwd = resetPwd;

        function resetPwd () {
		userBackend.updateUser(self.userId, self.form).then(function(){
			$state.go('user.users');
		})
        };
    }

})();
