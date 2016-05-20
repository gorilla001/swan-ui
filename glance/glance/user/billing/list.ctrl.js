(function () {
    'use strict';
    angular.module('glance.user')
        .controller('ListBillingCtrl', ListBillingCtrl);


    /* @ngInject */
    function ListBillingCtrl($state, $stateParams, appservice, billings, mdTable) {
        var self = this;

        self.table = mdTable.createTable('user.billings');
        self.billings = billings.billings;
        self.count = billings.count;

        var starttime, endtime;
        if($stateParams.starttime) {
            starttime = new Date($stateParams.starttime * 1000);
        }

        endtime = $stateParams.endtime && new Date(($stateParams.endtime - 24 * 60 * 60) * 1000);

        self.maxDate = new Date();
        self.form = {
            appname: $stateParams.appname || '',
            starttime: starttime,
            endtime: endtime
        };

        self.getBillings = getBillings;

        activate();

        function getBillings() {
            var params = {
                page: $stateParams.page,
                per_page: $stateParams.per_page
            };
            self.form.appname &&
            (params['appname'] = self.form.appname);
            self.form.starttime &&
            (params['starttime'] = parseInt(self.form.starttime.getTime() / 1000));
            // endtime plus one day
            self.form.endtime &&
            (params['endtime'] = parseInt(self.form.endtime.getTime() / 1000 + 24 * 60 * 60));

            $state.go('user.billings', params, {reload: true});
        }
        
        function activate() {
            getAppList()
        }

        function getAppList() {
            appservice.listApps()
                .then(function (data) {
                    self.apps = data.App;
                })
        }
    }
})();
