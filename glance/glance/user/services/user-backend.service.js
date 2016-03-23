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
            sendInviteEmail: sendInviteEmail,
            deleteGroupUsers: deleteGroupUsers,
            joinDemoGroup: joinDemoGroup
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
            return gHttp.Resource('user.groups').post(data);
        }

        function listGroupUser(groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).get()
        }

        function sendInviteEmail(data, groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).post(data);
        }

        function deleteGroupUsers(data, groupId) {
            return gHttp.Resource('user.groupMemberships', {group_id: groupId}).delete({data: data});
        }

        function joinDemoGroup() {
            return gHttp.Resource('user.groupDemo').post();
        }
    }
})();
