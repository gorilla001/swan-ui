(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailBriefCtrl', ImageDetailBriefCtrl);

    /* @ngInject */
    function ImageDetailBriefCtrl(project, imageBackend, Notification) {
        var self = this;
        self.readOnly = true;
        self.projectInfo = project;
        self.brief = project.description;

        self.updateBrief = updateBrief;

        function updateBrief() {
            self.projectInfo.description = self.brief;
            imageBackend.updateProject(self.projectInfo.id, self.projectInfo)
                .then(function (data) {
                    Notification.success('修改成功');
                    self.readOnly = true;
                }, function (res) {
                    self.readOnly = true;
                    self.brief = self.projectInfo.description
                })
        }
    }
})();