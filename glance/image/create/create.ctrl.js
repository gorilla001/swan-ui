(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageCreateCtrl', ImageCreateCtrl);

    ImageCreateCtrl.$inject = ['imageservice', '$rootScope', '$state', 'imageBuildSetting', 'listProjectsName', 'Notification'];

    function ImageCreateCtrl(imageservice, $rootScope, $state, imageBuildSetting, listProjectsName, Notification) {
        var self = this;
        ///
        self.form = {
            uid: parseInt($rootScope.userId),
            name: "",
            repoUri: "",
            triggerType: IMAGE_TRIGGER_TYPE.SELECT_TAG,
            active: true,
            period: 5,
            description: "",
            branch: "",
            image: ""
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

        self.projectsName = listProjectsName;
        self.triggerCount = 1;
        self.tag = true;
        self.branch = false;

        self.createProject = createProject;
        self.triggerCheck = triggerCheck;
        self.triggerRules = triggerRules;

        function createProject(fromData) {
            imageservice.createProject(fromData).then(function (data) {
                Notification.success('项目创建成功');
                $state.go('imageDetail.version',({projectId: data.id}))
            })
        }

        function triggerCheck(checkValue) {
            self.triggerCount = imageBuildSetting.triggerCheck(checkValue, self.triggerCount)
        }

        function triggerRules() {
            self.form.triggerType = imageBuildSetting.triggerRules(self.tag, self.branch);
        }
    }
})();