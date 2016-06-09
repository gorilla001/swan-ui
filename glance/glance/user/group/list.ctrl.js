(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListGroupCtrl', ListGroupCtrl);


    /* @ngInject */
    function ListGroupCtrl($rootScope, $state, Notification, userBackend, confirmModal, groups, mdTable) {
        var self = this;

        self.isCollapsed = true;
        self.isCollapsedGroupMapping = {};
        self.isOpenInvite = {};

        self.roleMapping = {
            'super_user': '管理员',
            'common': '成员'
        };

        self.createGroupForm = {
            name: '',
            description: ''
        };

        self.usernamesList = {};

        self.groupUserMapping = {};

        self.table = mdTable.createTable('user.groups');
        self.groups = groups.groups;
        self.count = groups.total;
        for(var g in self.groups) {
            self.usernamesList[self.groups[g].id] = '';
            self.isCollapsedGroupMapping[self.groups[g].id] = true;
            self.isOpenInvite[self.groups[g].id] = false;
        }

        /* 删除组 */
        self.deleteGroup = function(groupId, $event) {
            confirmModal.open('您确定要删除该用户吗？', $event).then(function () {
                userBackend.deleteGroup(groupId).then(function (data) {
                    Notification.success('删除成功');
                    $state.reload();
                }, function (res) {
                });
            });
        };

        /* 离开组 */
        self.leaveGroup = function(groupId, $event) {
            confirmModal.open('您确定要离开该用户组吗？', $event).then(function () {
                userBackend.leaveGroup(groupId).then(function (data) {
                    if(groupId == $rootScope.demoGroupId) {
                        $rootScope.notInDemoGroup = true;
                    }
                    Notification.success('离开成功');
                    $state.reload();
                }, function (res) {
                });
            });
        };

        /* 打开创建组 */
        self.createGroup = function() {
            if(!self.createGroupForm.name) {
                Notification.error('用户组名不能为空');
            } else {
                userBackend.createGroup(self.createGroupForm).then(function(data) {
                    self.isCollapsed = true;
                    $state.reload();
                }, function(res) {
                    angular.forEach(res.data, function(value, key) {
                        Notification.error(value);
                    })
                });
            }
        };

        /* 发送邀请 */
        self.sendInvitation = function(groupId) {
            var usernameStr = self.usernamesList[groupId].trim();
            if(!usernameStr) {
                Notification.error('邮箱地址不能为空');
            } else {
                var _usernames = usernameStr.split(',');
                var usernames = [];
                for(var i=0; i < _usernames.length; i++) {
                    usernames.push(_usernames[i].trim());
                }
                userBackend.sendInvitation({usernames: usernames}, groupId).then(function(data) {
                    /* TODO(mgniu): notification windows will be overlaped, this should be fixed */
                    if(data.error_names.length && data.invited_names.length) {
                        var errMsg = '下列用户不存在:<br>';
                        for (var i = 0; i < data.error_names.length; i++) {
                            errMsg += data.error_names[i] + '<br>'
                        }
                        Notification.warning(errMsg);

                        var notif = '下列用户已被邀请:<br>';
                        for (var i = 0; i < data.invited_names.length; i++) {
                            notif += data.invited_names[i] + '<br>'
                        }
                        Notification.success(notif);
                    }else {
                        if(data.error_names.length){
                            var errMsg = '下列用户不存在:<br>';
                            for (var i = 0; i < data.error_names.length; i++) {
                                errMsg += data.error_names[i] + '<br>'
                            }
                            Notification.warning(errMsg);
                        }else if(data.invited_names.length){
                            var notif = '下列用户已被邀请:<br>';
                            for (var i = 0; i < data.invited_names.length; i++) {
                                notif += data.invited_names[i] + '<br>'
                            }
                            Notification.success(notif);
                        }
                    }
                    if(data.need_send){
                        Notification.success("邀请成功");
                    }
                    self.showManagePanel(groupId);
                });
            }
        };

        self.deleteGroupUser = function(groupId, userId) {
            confirmModal.open('您确定要移除该用户吗？').then(function () {
                userBackend.deleteGroupUsers({users: [userId]}, groupId).then(function (data) {
                    self.isCollapsed = true;
                    Notification.success('移除成功');
                    $state.reload()
                }, function (res) {
                });
            });
        };

        self.collapseManagePanel = function(groupId) {
            if(!self.isCollapsedGroupMapping[groupId]) {
                self.isCollapsedGroupMapping[groupId] = true;
            } else {
                self.showManagePanel(groupId);
            }
        };

        /* 打开用户详情 */
        self.showManagePanel = function(groupId) {
            userBackend.listGroupUser(groupId).then(function (data) {
                self.isCollapsedGroupMapping[groupId] = false;
                self.groupUserMapping[groupId] = data;
            }, function (res) {
            });
        };

        self.joinInvitedGroup = function(groupId) {
            userBackend.joinInvitedGroup(groupId).then(function() {
                $state.reload();
            });
        };
    }
})();
