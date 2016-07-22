(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailSettingCtrl', ImageDetailSettingCtrl);

    /* @ngInject */
    function ImageDetailSettingCtrl($rootScope, project, imageBackend, Notification) {
        var self = this;

        self.projectInfo = project;

        self.form = {
            name: self.projectInfo.name,
            repoUri: self.projectInfo.repoUri,
            active: self.projectInfo.active,
            period: self.projectInfo.period,
            triggerType: self.projectInfo.triggerType,
            imageName: self.projectInfo.imageName,
            repoType: self.projectInfo.repoType
        };

        self.periodList = [
            {
                name: '5 分钟',
                value: 5
            },
            {
                name: '10 分钟',
                value: 10
            },
            {
                name: '半小时',
                value: 30
            }
        ];

        self.tag = (self.projectInfo.triggerType == $rootScope.IMAGE_TRIGGER_TYPE.SELECT_TAG) || (self.projectInfo.triggerType == $rootScope.IMAGE_TRIGGER_TYPE.SELECT_ALL);
        self.branch = (self.projectInfo.triggerType == $rootScope.IMAGE_TRIGGER_TYPE.SELECT_BRANCH) || (self.projectInfo.triggerType == $rootScope.IMAGE_TRIGGER_TYPE.SELECT_ALL);

        self.saveSetting = saveSetting;
        self.countTrigType = countTrigType;

        function countTrigType() {
            if (self.tag && self.branch) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_ALL
            } else if (self.tag) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_TAG
            } else if (self.branch) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_BRANCH
            }
        }

        function saveSetting() {
            imageBackend.updateProject(self.projectInfo.id, self.form)
                .then(function (data) {
                    Notification.success('设置保存成功');
                })
        }

    }
})();