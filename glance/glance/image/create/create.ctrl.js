(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageCreateCtrl', ImageCreateCtrl);

    /* @ngInject */
    function ImageCreateCtrl(imageBackend, $rootScope, $scope, $state, imageBuildSetting, Notification) {
        var self = this;
        ///
        self.form = {
            name: "",
            repoUri: "",
            triggerType: IMAGE_TRIGGER_TYPE.SELECT_TAG,
            active: true,
            period: 5,
            description: "",
            branch: "",
            imageName: ""
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

        self.projectsNameList = [];
        self.projectsImagesNameList = [];
        self.triggerCount = 1;
        self.tag = true;
        self.branch = false;

        self.createProject = createProject;
        self.triggerRules = triggerRules;

        activate();

        function activate(){
            listProjectsName()
        }

        function listProjectsName(){
            imageBackend.listProjects().then(function (data) {
                angular.forEach(data.Project, function (value, index) {
                    self.projectsNameList.push(value.name);
                    self.projectsImagesNameList.push(value.imageName)
                });
            })
        }

        function createProject(fromData) {
            imageBackend.createProject(fromData, $scope.staticForm).then(function (data) {
                Notification.success('项目创建成功');
                $state.go('image.detail.version',({projectId: data.id}))
            })
        }

        function triggerRules(checkValue) {
            self.triggerCount = imageBuildSetting.triggerCheck(checkValue, self.triggerCount);
            self.form.triggerType = imageBuildSetting.triggerRules(self.tag, self.branch);
        }
    }
})();