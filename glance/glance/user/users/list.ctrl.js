(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListUserCtrl', ListUserCtrl);


    /* @ngInject */
    function ListUserCtrl($state, $stateParams, mdTable, userBackend, confirmModal, users) {
        var self = this;

        self.table = mdTable.createTable('user.users');

        self.users = [];

        self.USER_STATUS = USER_STATUS;
        self.USER_TYPE = USER_TYPE;
        
        self.table = mdTable.createTable('user.users');
        self.users = users.users;
        self.count = users.total;

        self.deleteUser = deleteUser;
        self.enableUser = enableUser;
        self.disableUser = disableUser;

        
        function deleteUser(ev, user_id) {
            confirmModal.open('确定删除该用户吗?', ev).then(function () {
                userBackend.deleteUser(user_id).then(function () {
                    $state.reload();
                });
            })
        }
        function enableUser(user_id) {
            userBackend.enableUser(user_id).then(function() {
                $state.reload();
    	})
        }
        function disableUser(user_id) {
            userBackend.disableUser(user_id).then(function() {
                $state.reload();
            })
        }

    }
})();
