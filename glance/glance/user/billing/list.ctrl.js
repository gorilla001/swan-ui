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
        endtime = $stateParams.endtime && new Date($stateParams.endtime * 1000);

        self.form = {
            appname: $stateParams.appname || '',
            starttime: starttime,
            endtime: endtime
        };

        //datetimepicker option
        self.dateOptions = {
            startingDay: 1,
            showWeeks: false
        };
        self.showMeridian = false;
        self.minuteStep = 1;
        self.hourStep = 1;

        self.isDisableGteDate = function (curDate, mode) {
            return false;
        };
        self.isDisablelteDate = function (curDate, mode) {
            return false;
        };

        self.getBillings = getBillings;

        activate();

        function getBillings() {
            var params = {
                pcount: $stateParams.pcount,
                pnum: $stateParams.pnum,
                starttime: parseInt(self.form.starttime.getTime() / 1000),
                endtime: parseInt(self.form.endtime.getTime() / 1000)
            };
            if(self.form.appname) {
                params['appname'] = self.form.appname;
            }

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
