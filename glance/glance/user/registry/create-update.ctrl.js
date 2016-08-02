(function () {
    'use strict';
    angular.module('glance.user')
        .controller('CreateRegistryCtrl', CreateRegistryCtrl);

    /* @ngInject */
    function CreateRegistryCtrl($state, $stateParams, Notification, confirmModal,
                                userBackend, target, registry) {
        var self = this;

        self.target = target;
        if (self.target === 'create') {
            self.form = {
                username: '',
                password: '',
                address: ''
            };
        } else {
            self.form = {
                address: registry.address,
                username: registry.username,
                password: ''
            };
        }

        self.createRegistry = createRegistry;
        self.updateRegistry = updateRegistry;

        function _createRegistry() {
            return userBackend.createRegistry(self.form)
                .then(function (data) {
                    Notification.success('仓库' + self.form.address + '创建成功！');
                    $state.go('user.registries', {reload: true});
                });
        }

        function createRegistry(ev) {
            userBackend.getRegistryByAddress(self.form.address).then(function(data) {
                if(!data) {
                    _createRegistry();
                } else {
                    return confirmModal.open("已有相同地址的仓库,是否覆盖？", ev).then(function () {
                        _createRegistry();
                    });
                }
            });
        }
        
        function updateRegistry() {
            var sendForm = {username: self.form.username, password: self.form.password};
            return userBackend.updateRegistry($stateParams.registry_id, sendForm)
                .then(function (data) {
                    Notification.success('仓库' + self.form.address + '编辑成功！');
                    $state.go('user.registries', {reload: true});
                });
        }

    }
})();