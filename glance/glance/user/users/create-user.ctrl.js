(function () {
    'use strict';
    angular.module('glance.user')
        .controller('CreateUserCtrl', CreateUserCtrl);

    /*@ngInject*/
    function CreateUserCtrl(userBackend,
                           Notification,
                           $state,
                           $stateParams,
                           $scope){
        var self = this;
        self.userNames = []

        self.form = {
            name: "",
            password: "", 
            email: "",
        };

        self.createUser = createUser;

        function createUser() {
            return userBackend.createUser(self.form, $scope.staticForm)
                .then(function () {
                    $state.go('user.users');
                });
        };
    }

})();
