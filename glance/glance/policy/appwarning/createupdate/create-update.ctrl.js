(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateWarningCtrl', CreateWarningCtrl);

    /* @ngInject */
    function CreateWarningCtrl(appWarningBackend, appservice, target, $state, warning, warningCurd, $stateParams, Notification, $scope, repeatModal) {
        var self = this;
        self.target = target;
        self.app = {};
        self.form = {
            appalias: warning.appalias || '',
            appname: warning.appname,
            metric: warning.metric || 'MemoryUsed',
            operator: warning.operator || '>',
            threshold: warning.threshold || '',
            emails: warning.emails || '',
            duration: warning.duration || '',
            times: warning.times || '',
            enabled: warning.enabled || 1, // Deprecated api
            triger: warning.triger || false,
            mininstance: warning.mininstance || '',
            instance: warning.instance || '',
            level: warning.level || 'info'
        };

        if (self.target === 'update' && warning.metric === 'CpuUsedCores') {
            self.form.threshold = self.form.threshold * 100
        }

        self.selectRules = [
            {
                name: '内存',
                label: 'MemoryUsed'
            },
            {
                name: 'CPU 使用',
                label: 'CpuUsedCores'
            },
            {
                name: '磁盘读取',
                label: 'DiskIOReadBytesRate'
            },
            {
                name: '磁盘写入',
                label: 'DiskIOWriteBytesRate'
            },
            {
                name: '网络接收',
                label: 'NetworkReceviedByteRate'
            },
            {
                name: '网络发送',
                label: 'NetworkSentByteRate'
            },
            {
                name: '每秒请求数',
                label: 'reqrate'
            }
        ];

        self.selectSize = [
            {
                name: '大于',
                label: '>'
            },
            {
                name: '小于',
                label: '<'
            }
        ];

        self.apps = [];

        self.submit = submit;
        self.getAppList = getAppList;

        activate();

        function activate() {
            getAppList();
        }

        function getAppList() {
            appservice.listApps()
                .then(function (data) {
                    self.apps = data.App;
                })
        }

        function submit(ev) {
            self.form.threshold = (self.form.metric === 'CpuUsedCores' ? self.form.threshold / 100 : self.form.threshold).toString();
            self.form.appid = self.app.id || warning.appid || 0;
            self.form.cid = self.app.cid || parseInt(warning.cid) || '';
            if (!self.form.triger) {
                delete self.form.instance;
                delete self.form.mininstance;
            }

            if (self.target === 'create') {
                self.form.appalias = self.app.alias;
                self.form.appname = self.app.name;

                appWarningBackend.createWarning(self.form, $scope.warningForm)
                    .then(function (data) {
                        $state.go('policy.tab.appwarning.warninglist', {per_page: 20, page: 1}, {reload: true})
                    }, function (res) {
                        self.form.threshold = self.form.metric === 'CpuUsedCores' ? self.form.threshold * 100 : self.form.threshold;

                        //if the policy is existence, should be pop a modal to notice user
                        if (res.code == 18002) {
                            var policyId = res.data.id;
                            repeatModal.open(ev)
                                .then(function (data) {
                                    $state.go('policy.WarningUpdate', {task_id: policyId});
                                }, function (res) {
                                    $state.go('policy.tab.appwarning.warninglist');
                                });
                        }

                    })
            } else {
                self.form.id = parseInt($stateParams.task_id);
                self.form.cid = parseInt(warning.cid);

                warningCurd.updateTask(self.form, $scope.warningForm)
                    .then(function (data) {
                        Notification.success("更新成功");
                        $state.go('policy.tab.appwarning.warninglist', {per_page: 20, page: 1})
                    }, function (res) {
                        self.form.threshold = self.form.metric === 'CpuUsedCores' ? self.form.threshold * 100 : self.form.threshold;

                        //if the policy is existence, should be pop a modal to notice user
                        if (res.code == 18002) {
                            var policyId = res.data.id;
                            repeatModal.open(ev)
                                .then(function (data) {
                                    $state.go('policy.WarningUpdate', {task_id: policyId});
                                }, function (res) {
                                    $state.go('policy.tab.appwarning.warninglist');
                                });
                        }
                    });
            }
        }
    }
})();
