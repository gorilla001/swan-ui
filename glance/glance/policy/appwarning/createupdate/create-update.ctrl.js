(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateWarningCtrl', CreateWarningCtrl);

    /* @ngInject */
    function CreateWarningCtrl(appWarningBackend, appservice, target, $state, warning, warningCurd, $stateParams, Notification) {
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
            enabled: true
        };

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
            }
        ];

        self.selectSize = [
            {
                name: '大于',
                label: '>'
            },
            {
                name: '等于',
                label: '='
            },
            {
                name: '小于',
                label: '<'
            }
        ];

        self.apps = [];

        self.create = create;
        self.update = update;

        activate();

        function activate() {
            getAppList()
        }

        function getAppList() {
            appservice.listApps()
                .then(function (data) {
                    self.apps = data.App;
                })
        }

        ////
        function create() {
            self.form.appalias = self.app.alias;
            self.form.appname = self.app.name;

            appWarningBackend.createWarning(self.form)
                .then(function (data) {
                    $state.go('policy.appwarning.warninglist', {per_page: 20, page: 1}, {reload: true})
                })

        }

        function update() {
            self.form.id = parseInt($stateParams.task_id);
            self.form.cid = parseInt(warning.cid);
            warningCurd.updateTask(self.form)
                .then(function (data) {
                    Notification.success("更新成功");
                    $state.go('policy.appwarning.warninglist', {per_page: 20, page: 1})
                });
        }
    }
})();