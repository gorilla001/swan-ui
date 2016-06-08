(function () {
    'use strict';
    angular.module('glance.user')
        .controller('UpdateUserCtrl', UpdateUserCtrl);

    /*@ngInject*/
    function UpdateUserCtrl(userBackend,
                           Notification,
                           $state,
                           $stateParams,
                           $scope){
        var self = this;

        self.userId = $stateParams.user_id; 
            
        activate();
            
        self.updateUser = updateUser;
    
        function activate() {
            userBackend.getUser(self.userId).then(function(data) {
                self.form = data;
            })
        }

        function updateUser() {
            self.data = {
                email: self.form.email,
            }
            userBackend.updateUser(self.userId, self.data, $scope.staticForm).then(function(){
                $state.go('user.users');
            })
        };
    }

})();
