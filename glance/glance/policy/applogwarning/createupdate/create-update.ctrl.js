(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateLogWarningCtrl', CreateLogWarningCtrl);

    /* @ngInject */
    function CreateLogWarningCtrl(appservice, $state, logWarningBackend, clusterBackend,
                                  Notification, target, logPolicy, $scope) {
        var self = this;
        var clusters = [];
        var clusterMapping = [];

        var alarm = logPolicy.alarm || '';

        self.target = target;
        self.form = {
            clusterid: alarm.cid || '',
            appalias: alarm.appalias || '',
            appid: alarm.appid || '',
            interval: alarm.ival || '',
            gtnum: alarm.gtnum || '',
            keyword: alarm.keyword || '',
            emails: alarm.emails || '',
            usertype: alarm.usertype || '',
            appname: alarm.appname,
            scaling: alarm.scaling || false,
            mins: alarm.mins || '',
            maxs: alarm.maxs|| ''
        };
        self.submit = submit;
        self.getAppList= getAppList;
        ////

        activate();

        function activate() {

            listCluster();
            getAppList();
        }

        function listCluster() {
            clusterBackend.listClusters()
                .then(function (data) {
                    angular.forEach(data, function (cluster, index) {
                        if (cluster.group_id) {
                            clusters.push({id: cluster.id, name: cluster.group_name + ":" + cluster.name});
                        } else {
                            clusters.push({id: cluster.id, name: cluster.name});
                        }
                        clusterMapping[cluster.id] = cluster;
                    });
                });
        }

        function getAppList() {
            appservice.listApps()
                .then(function (data) {
                    self.apps = data.App;
                })
        }

        function submit() {
            if(!self.form.scaling){
                delete self.form.mins;
                delete self.form.maxs;
            }

            if (self.target === 'create') {
                self.form.usertype = clusterMapping[self.app.cid].group_id ? 'group' : 'user';
                self.form.appalias = self.app.alias;
                self.form.appname = self.app.name;
                self.form.appid = self.app.id;
                self.form.clusterid = self.app.cid;
                logWarningBackend.createLogPolicy(self.form, $scope.logwarningForm)
                    .then(function (data) {
                        Notification.success('日志告警创建成功');
                        $state.go('policy.tab.applogwarning.loglist', {per_page: 20, page: 1}, {reload: true})
                    })
            } else {
                self.form.id = parseInt(alarm.id);
                logWarningBackend.updateLogPolicy(self.form, $scope.logwarningForm)
                    .then(function (data) {
                        Notification.success('日志告警更新成功');
                        $state.go('policy.tab.applogwarning.loglist', {per_page: 20, page: 1}, {reload: true})
                    });
            }
        }
    }
})();