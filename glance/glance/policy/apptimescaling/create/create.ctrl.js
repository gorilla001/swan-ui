(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateScalingCtrl', CreateScalingCtrl);

    /* @ngInject */
    function CreateScalingCtrl(appservice, $state, $stateParams, Notification) {
        var self = this;
        self.form = {
            appname: '',
            startTime: new Date(),
            instances: 1,
            times: '',
            cycleType: 'year',
            cycleTimes: ''
        };

        self.selectCycle = [
            {
                name: '年',
                label: 'year'
            },
            {
                name: '月',
                label: 'month'
            },
            {
                name: '日',
                label: 'day'
            },
            {
                name: '时',
                label: 'hour'
            },
            {
                name: '分',
                label: 'minute'
            }
        ];

        //datetimepicker option
        self.dateOptions = {
            startingDay: 1,
            showWeeks: false
        };
        self.showMeridian = false;
        //

        self.create = create;

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
            ///
        }
    }
})();