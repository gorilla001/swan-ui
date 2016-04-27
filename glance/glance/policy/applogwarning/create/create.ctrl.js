(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateLogWarningCtrl', CreateLogWarningCtrl);

    /* @ngInject */
    function CreateLogWarningCtrl(appservice, $state, logWarningBackend) {
        var self = this;

        self.form = {
            clusterid: '',
            appalias: '',
            interval: '',
            gtnum: '',
            keyword: '',
            emails: ''
        };
        self.create = create;

        ////

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

        function create() {
            self.form.appalias = self.app.alias;
            self.form.clusterid = self.app.cid;
            logWarningBackend.createLogPolicy(self.form)
                .then(function (data) {
                    Notification.success('日志告警创建成功');
                    $state.go('policy.applogwarning.loglist', {per_page: 20, page: 1}, {reload: true})
                })

        }
    }
})();