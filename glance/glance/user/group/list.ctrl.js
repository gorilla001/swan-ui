(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListGroupCtrl', ListGroupCtrl);

    ListGroupCtrl.$inject = [
        '$rootScope',
        '$state',
        'Notification',
        'ngTableParams',
        'confirmModal',
        'userBackend'
    ];

    function ListGroupCtrl($rootScope, $state, Notification, ngTableParams, confirmModal, userBackend) {
        $rootScope.userTabFlag = 'groups';
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

        self.inviteForm = {
            emails: ''
        };

        self.groupUserMapping = {};
        
        self.grouplist = [];
        self.showNothtingAlert = false;     //应用列表空标记

        self.isFirstLoad = true;

        self.groupListTable = new ngTableParams($rootScope.groupListParams, {
                counts: [20, 50, 100], // custom page count
                total: 0,
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {
                    var loading = "";
                    if (self.isFirstLoad) {
                        loading = undefined;
                    }
                    $rootScope.groupListParams = self.groupListTable.parameters();
                    userBackend.listGroups(dealParams(params.url()), loading)
                        .then(function (data) {
                            //If you remove when the current grouplication of only one grouplication,
                            //set new Page and Switch back page
                            if (!data.groups.length && $rootScope.groupListParams.page > 1) {
                                $rootScope.groupListParams.page = $rootScope.groupListParams.page - 1
                            }
                            var total = data.total;
                            self.grouplist = data.groups;
                            for(var g in self.grouplist) {
                                self.isCollapsedGroupMapping[self.grouplist[g].id] = true;
                                self.isOpenInvite[self.grouplist[g].id] = false;
                            }

                            //Check whether show the warning dialog
                            self.showNothtingAlert = !self.grouplist.length;
                            params.total(total);
                            if (total > 0) {
                                $defer.resolve(data.groups);
                            }

                            self.isFirstLoad = false;
                        }, function (res) {

                        });
                }
            }
        );

        /* 删除组 */
        self.deleteGroup = function(groupId) {
            confirmModal.open('您确定要删除该用户吗？').then(function () {
                userBackend.deleteGroup(groupId).then(function (data) {
                    $state.reload();
                }, function (res) {
                    Notification.error(res.data.group);
                });
            });
        };

        /* 离开组 */
        self.leaveGroup = function(groupId) {
            confirmModal.open('您确定要离开该用户组吗？').then(function () {
                userBackend.leaveGroup(groupId).then(function (data) {
                    if(groupId == $rootScope.demoGroupId) {
                        $rootScope.notInDemoGroup = true;
                    }
                    $state.reload();
                }, function (res) {
                    Notification.error(res.data.group);
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

        /* 发送邀请邮件 */
        self.sendInviteEmail = function(groupId) {
            var emailStr = self.inviteForm.emails.trim();
            if(!emailStr) {
                Notification.error('邮箱地址不能为空');
            } else {
                var _emails = self.inviteForm.emails.split(',');
                var emails = [];
                for(var i=0; i < _emails.length; i++) {
                    emails.push(_emails[i].trim());
                }
                userBackend.sendInviteEmail({emails: emails}, groupId).then(function(data) {
                    if(data.error_emails.length) {
                        var errMsg = '下列用户不存在:<br>';
                        for (var i = 0; i < data.error_emails.length; i++) {
                            errMsg += data.error_emails[i] + '<br>'
                        }
                        Notification.warning(errMsg);
                    } else {
                        Notification.success("邀请邮件发送成功");
                    }
                });
            }
        };

        self.deleteGroupUser = function(groupId, userId) {
            confirmModal.open('您确定要移除该用户吗？').then(function () {
                userBackend.deleteGroupUsers({users: [userId]}, groupId).then(function (data) {
                    self.isCollapsed = true;
                    $state.reload()
                }, function (res) {
                    Notification.error(res.data.group);
                });
            });
        };

        /* 打开用户详情 */
        self.showManagePanel = function(groupId) {
            if(!self.isCollapsedGroupMapping[groupId]) {
                self.isCollapsedGroupMapping[groupId] = true;
            } else {
                userBackend.listGroupUser(groupId).then(function (data) {
                    self.isCollapsedGroupMapping[groupId] = false;
                    self.groupUserMapping[groupId] = data;
                }, function (res) {
                    Notification.error(res.data.group);
                });
            }
        };

        self.joinDemoGroup = function () {
              userBackend.joinDemoGroup().then(function(){
                  $state.reload();
              });
        };

        /*
         修改 ngTable 默认的 params.url() 为数人云标准格式
         */
        function dealParams(urlParams) {
            var data = {};
            for (var key in urlParams) {
                var temp = key;

                if (key === 'count') {
                    temp = 'per_page';
                }

                if (key.includes('sorting')) {
                    temp = 'order';
                    data['sort_by'] = key.slice(8, -1)
                }
                data[temp] = urlParams[key]
            }
            return data;
        }
    }
})();
