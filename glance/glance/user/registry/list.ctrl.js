(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListRegistryCtrl', ListRegistryCtrl);

    /* @ngInject */
    function ListRegistryCtrl($state, mdTable, confirmModal, userBackend, registries) {
        var self = this;

        self.table = mdTable.createTable('user.registries');
        self.registries = registries.registries;
        self.count = registries.total;

        self.deleteRegistry = deleteRegistry;
        self.goEditRegistry = goEditRegistry;
        
        function deleteRegistry(registryId, ev) {
            confirmModal.open("确定删除仓库?", ev).then(function () {
                userBackend.deleteRegistry(registryId).then(function() {
                    $state.reload();
                });
            });
        }

        function goEditRegistry(registryId) {
            $state.go('updateregistry', {registry_id: registryId}, {'reload': true});
        }
    }
})();