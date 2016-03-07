(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageCreateCtrl', ImageCreateCtrl);

    ImageCreateCtrl.$inject = ['imageservice', '$rootScope', '$state'];

    function ImageCreateCtrl(imageservice, $rootScope, $state) {
        var self = this;
        ///
        self.form = {
            uid: parseInt($rootScope.userId),
            name: "",
            repoUri: "",
            triggerType: 1,
            active: true,
            period: 5
        };

        self.periodList = [
            {
                name: '5 分钟',
                value: 5
            },
            {
                name: '10 分钟',
                value: 10
            }
        ];

        self.triggerCount = 1;
        self.tag = true;
        self.branch = false;

        self.createProject = function (fromData) {
            console.log(self.form);
            imageservice.createProject(fromData).then(function (data) {
                $state.go('imageHome')
            })
        };

        self.triggerCheck = function (checkValue) {
            if (checkValue) {
                self.triggerCount++;
            } else {
                self.triggerCount--;
            }
        };

        self.triggerRules = function () {
            if (self.tag && self.branch) {
                self.form.triggerType = 3
            } else if (self.tag) {
                self.form.triggerType = 1
            } else if (self.branch) {
                self.form.triggerType = 2
            }
        }
    }
})();