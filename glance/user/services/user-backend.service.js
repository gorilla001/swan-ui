(function () {
    'use strict';
    angular.module('glance.app')
        .factory('userBackend', userBackend);

    userBackend.$inject = ['Notification', 'gHttp'];

    function userBackend(Notification, gHttp) {
        return {
            listGroups: listGroups,
            deleteGroup: deleteGroup,
            leaveGroup: leaveGroup
        };

        function listGroups(params, loading) {
            return gHttp.Resource('user.groups').get({params: params, loading: loading});
        }

        function deleteGroup(groupId) {
            return gHttp.Resource('user.group', {group_id: groupId}).delete();
        }

        function leaveGroup(groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).delete();
        }
    }
})();