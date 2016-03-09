(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListGroupCtrl', ListGroupCtrl);

    ListGroupCtrl.$inject = ['$rootScope', '$state', 'Notification', 'formModal', 'ngTableParams', 'userBackend'];

    function ListGroupCtrl($rootScope, $state, Notification, formModal, ngTableParams, userBackend) {
        $rootScope.userTabFlag = 'groups';
        var self = this;

        self.roleMapping = {
            'super_user': '管理员',
            'common': '成员'
        };
        
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

        /* 删除租户 */
        self.deleteGroup = function(groupId) {
            userBackend.deleteGroup(groupId).then(function (data) {
                $state.reload();
            }, function(res) {
                Notification.error(res.data.group);
            });
        };

        /* 离开租户 */
        self.leaveGroup = function(groupId) {
            userBackend.leaveGroup(groupId).then(function (data) {
                $state.reload();
            }, function(res) {
                Notification.error(res.data.group);
            });
        };

        /* 打开创建租户modal */
        self.openCreateGroupModule = function () {
            formModal.open('/user/group/modals/create-group.html').then(function (data) {
                console.log(data)
                userBackend.createGroup(data).then(function(data) {
                    $state.reload()
                }, function(res) {
                    Notification.error(res.data.group);
                });
                return false;
            }, function(data) {
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
