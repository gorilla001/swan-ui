(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailSettingCtrl', ImageDetailSettingCtrl);

    ImageDetailSettingCtrl.$inject = ['project', 'imageBackend', 'Notification', 'imageBuildSetting'];

    function ImageDetailSettingCtrl(project, imageBackend, Notification, imageBuildSetting) {
        var self = this;

        self.projectInfo = project;

        self.form = {
            name: self.projectInfo.name,
            repoUri: self.projectInfo.repoUri,
            active: self.projectInfo.active,
            period: self.projectInfo.period,
            triggerType: self.projectInfo.triggerType,
            imageName: self.projectInfo.imageName
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

        self.triggerCount = (self.projectInfo.triggerType > IMAGE_TRIGGER_TYPE.SELECT_BRANCH) ? self.projectInfo.triggerType - 1 : IMAGE_TRIGGER_TYPE.SELECT_TAG;
        self.tag = (self.projectInfo.triggerType == IMAGE_TRIGGER_TYPE.SELECT_TAG) || (self.projectInfo.triggerType == IMAGE_TRIGGER_TYPE.SELECT_ALL);
        self.branch = (self.projectInfo.triggerType == IMAGE_TRIGGER_TYPE.SELECT_BRANCH) || (self.projectInfo.triggerType == IMAGE_TRIGGER_TYPE.SELECT_ALL);

        self.saveSetting = saveSetting;
        self.triggerCheck = triggerCheck;
        self.triggerRules = triggerRules;

        function triggerCheck(checkValue) {
            self.triggerCount = imageBuildSetting.triggerCheck(checkValue, self.triggerCount)
        }

        function triggerRules() {
            self.form.triggerType = imageBuildSetting.triggerRules(self.tag, self.branch)
        }

        function saveSetting() {
            imageBackend.updateProject(self.projectInfo.id, self.form)
                .then(function (data) {
                    Notification.success('设置保存成功');
                })
        }

    }
})();