(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('CreateScalingCtrl', CreateScalingCtrl);

    /* @ngInject */
    function CreateScalingCtrl(appservice, $state, $stateParams, Notification, appScalingBackend) {
        var self = this;
        self.form = {
            appName: '',
            started: new Date(),
            instance: 1,
            times: '',
            durationType: 'year',
            duration: ''
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
                name: '周',
                label: 'week'
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
            self.form.appName = self.selectApp.name;
            appScalingBackend.createScaling(self.selectApp.cid, self.selectApp.id, self.form)
                .then(function (data) {
                    Notification.success('扩缩策略创建成功');
                    $state.go('policy.apptimescaling.scalinglist', {per_page: 20, page: 1}, {reload: true})
                })
        }
    }
})();