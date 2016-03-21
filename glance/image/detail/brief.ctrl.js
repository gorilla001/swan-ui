(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailBriefCtrl', ImageDetailBriefCtrl);

    ImageDetailBriefCtrl.$inject = ['project', '$scope'];

    function ImageDetailBriefCtrl(project, $scope) {
        var self = this;
        self.projectInfo = project;

        $scope.$parent.activeTab = 'brief';
    }
})();