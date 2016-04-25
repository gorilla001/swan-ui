(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateLogWarningCtrl', CreateLogWarningCtrl);

    /* @ngInject */
    function CreateLogWarningCtrl($rootScope, clusterBackendService, appservice) {
        var self = this;
        var clusters = [];
        var clusterMapping = [];

        self.form = {
            userid: $rootScope.userId,
            clusterid: '',
            appalias: '',
            interval: '',
            gtnum: '',
            keyword: '',
            emails: '',
            usertype: ''
        };
        self.create = create;

        ////

        activate();

        function activate() {
            listCluster();
            getAppList()
        }

        function listCluster() {
            clusterBackendService.listClusters()
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

        function create() {
            self.form.usertype = clusterMapping[self.app.cid].group_id ? 'group' : 'user';
            self.form.appalias = self.app.alias;
            self.form.clusterid = self.app.cid;
            console.log(self.form)

        }
    }
})();