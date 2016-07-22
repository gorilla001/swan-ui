(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageCreateCtrl', ImageCreateCtrl);

    /* @ngInject */
    function ImageCreateCtrl(imageBackend, $rootScope, $scope, $state, Notification) {
        var self = this;
        self.GIT = 0;
        self.SVN = 1;

        ///
        self.form = {
            name: "",
            repoUri: "",
            triggerType: $rootScope.IMAGE_TRIGGER_TYPE.SELECT_TAG,
            active: true,
            period: 5,
            description: "",
            branch: "",
            imageName: "",
            repoType: 0
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
        self.tag = true;
        self.branch = false;

        self.createProject = createProject;
        self.countTrigType = countTrigType;
        self.modeChange = modeChange;

        activate();

        function activate() {
            listProjectsName()
        }

        function listProjectsName() {
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
                $state.go('image.detail.version', ({projectId: data.id}))
            })
        }

        function countTrigType() {
            if (self.tag && self.branch) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_ALL
            } else if (self.tag) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_TAG
            } else if (self.branch) {
                self.form.triggerType = $rootScope.IMAGE_TRIGGER_TYPE.SELECT_BRANCH
            }
        }

        function modeChange(repoType) {
            if (repoType === self.SVN) {
                self.tag = false;
                self.branch = true;
            } else {
                self.tag = true;
                self.branch = false;
            }

            countTrigType()
        }
    }
})();