(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListBillingCtrl', ListBillingCtrl);


    /* @ngInject */
    function ListBillingCtrl($state, $stateParams, clusterBackendService, appservice, billings, apps, clusters, mdTable) {
        var self = this;

        self.table = mdTable.createTable('user.billings');
        self.billings = billings.billings;
        self.count = billings.count;
        self.apps = apps.App;
        self.clusters = {};

        var starttime, endtime;
        if($stateParams.starttime) {
            starttime = new Date($stateParams.starttime * 1000);
        }

        endtime = $stateParams.endtime && new Date(($stateParams.endtime - 24 * 60 * 60) * 1000);

        self.maxDate = new Date();
        self.form = {
            appid: '',
            starttime: starttime,
            endtime: endtime
        };

        self.getBillings = getBillings;

        activate();

        function activate() {
            angular.forEach(clusters, function (cluster, index) {
                self.clusters[cluster.id] = cluster;
            });

            if($stateParams.appname && $stateParams.cid && self.apps.length) {
                for(var i=0; i < self.apps.length; i++) {
                    if(self.apps[i].name == $stateParams.appname && self.apps[i].cid == $stateParams.cid) {
                        self.form.appid = self.apps[i].id;
                        break;
                    }
                }
            }
        }

        function getBillings(page) {
            var params = {
                page: page || $stateParams.page,
                per_page: $stateParams.per_page
            };
            if(self.form.appid) {
                if(self.apps.length) {
                    for(var i=0; i < self.apps.length; i++) {
                        if(self.apps[i].id == self.form.appid) {
                            params['appname'] = self.apps[i].name;
                            params['cid'] = self.apps[i].cid;
                            break;
                        }
                    }
                }
            } else {
                params['appname'] = undefined;
                params['cid'] = undefined;
            }
            self.form.starttime
                ? (params['starttime'] = parseInt(self.form.starttime.getTime() / 1000))
                : (params['starttime'] = '');
            // endtime plus one day
            self.form.endtime
                ? (params['endtime'] = parseInt(self.form.endtime.getTime() / 1000 + 24 * 60 * 60))
                : (params['endtime'] = '');

            $state.go('user.billings', params, {reload: true});
        }
    }
})();
