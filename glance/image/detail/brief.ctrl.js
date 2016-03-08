(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailBriefCtrl', ImageDetailBriefCtrl);

    ImageDetailBriefCtrl.$inject = ['project'];

    function ImageDetailBriefCtrl(project) {
        var self = this;
        self.projectInfo = project
    }
})();