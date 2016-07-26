(function () {
    'use strict';
    angular.module('glance.app')
        .factory('userBackend', userBackend);

    userBackend.$inject = ['Notification', 'gHttp'];

    function userBackend(Notification, gHttp) {
        return {
            listGroups: listGroups,
            deleteGroup: deleteGroup,
            leaveGroup: leaveGroup,
            createGroup: createGroup,
            listGroupUser: listGroupUser,
            sendInvitation: sendInvitation,
            deleteGroupUsers: deleteGroupUsers,
            joinInvitedGroup: joinInvitedGroup,
            listBillings: listBillings,
            getLicenceInfo: getLicenceInfo,
            validateLicence: validateLicence,
            createUser: createUser,
            listUsers: listUsers,
            deleteUser: deleteUser,
            disableUser: disableUser,
            enableUser: enableUser,
            getUser: getUser,
            updateUser: updateUser,
            listRegistries: listRegistries,
            createRegistry: createRegistry,
            deleteRegistry: deleteRegistry,
            getRegistry: getRegistry,
            updateRegistry: updateRegistry,
            getRegistryByAddress: getRegistryByAddress
        };

        function listGroups(params, loading) {
            return gHttp.Resource('user.groups').get({params: params, loading: loading});
        }

        function deleteGroup(groupId) {
            return gHttp.Resource('user.group', {group_id: groupId}).delete();
        }

        function leaveGroup(groupId) {
            return gHttp.Resource('user.groupMyMemberships', {group_id: groupId}).delete();
        }

        function createGroup(data){
            return gHttp.Resource('user.groups').post(data, {ignoreCodes: [10001]});
        }

        function listGroupUser(groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).get()
        }

        function sendInvitation(data, groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).post(data);
        }

        function deleteGroupUsers(data, groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).delete({data: data});
        }

        function joinInvitedGroup(groupId) {
            return gHttp.Resource('user.groupMyMemberships', {group_id: groupId}).post();
        }

        function listBillings(params) {
            return gHttp.Resource('billing.billings').get({params: params});
        }

        function getLicenceInfo() {
            return gHttp.Resource('licence.licence').get();
        }

        function validateLicence(content) {
            return gHttp.Resource('licence.licence').post({content: content});
        }

        function createUser(data, form) {
            return gHttp.Resource('user.users').post(data, {form: form});
        }

        function listUsers(params, loading){
            return gHttp.Resource('user.users').get({params: params, loading: loading});
        }

        function deleteUser(user_id){
            return gHttp.Resource('user.user', {user_id: user_id}).delete();
        }

        function disableUser(user_id){
            return gHttp.Resource('user.user', {user_id: user_id}).patch({'method': 'disable'});
        }

        function enableUser(user_id, data) {
            return gHttp.Resource('user.user', {user_id: user_id}).patch({'method': 'enable'});
        }
        
        function getUser(user_id) {
            return gHttp.Resource('user.user', {user_id: user_id}).get();
        }
        
        function updateUser(user_id, data, form) {
            return gHttp.Resource('user.user', {user_id: user_id}).put(data, {form: form});
        }

        function listRegistries(params, loading) {
            return gHttp.Resource('registry.registries').get({params: params, loading: loading});
        }

        function getRegistry(registryId) {
            return gHttp.Resource('registry.registry', {registry_id: registryId}).get();
        }
        
        function getRegistryByAddress(address) {
            return gHttp.Resource('registry.address', {address: address}).get();
        }

        function createRegistry(data) {
            return gHttp.Resource('registry.registries').post(data);
        }

        function updateRegistry(registryId, data) {
            return gHttp.Resource('registry.registry', {registry_id: registryId}).put(data);
        }

        function deleteRegistry(registryId) {
            return gHttp.Resource('registry.registry', {registry_id: registryId}).delete();
        }
    }
})();
