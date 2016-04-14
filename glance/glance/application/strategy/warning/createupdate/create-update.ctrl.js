(function () {
    'use strict';
    angular.module('glance.app')
        .controller('CreateWarningCtrl', CreateWarningCtrl);

    /* @ngInject */
    function CreateWarningCtrl(appWarningBackend, $stateParams, appservice, target) {
        var self = this;
        self.target = target;
        self.app = {};
        self.form = {
            appalias: $stateParams.app_alias,
            appname: $stateParams.app_name,
            metric: 'MemUsed',
            operator: '>',
            threshold: '',
            emails: '',
            duration: '',
            times: '',
            enabled: true
        };

        self.selectRules = [
            {
                name: '内存',
                label: 'MemUsed'
            },
            {
                name: 'CPU 使用',
                label: 'CpuUsed'
            },
            {
                name: '磁盘 I/O',
                label: 'DiskUsed'
            },
            {
                name: '网络 I/O',
                label: 'NetUsed'
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
            console.log(self.form)

        }

        function update() {
            console.log(self.form)
        }
    }
})();