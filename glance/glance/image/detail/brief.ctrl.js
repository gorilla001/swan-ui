(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailBriefCtrl', ImageDetailBriefCtrl);

    /* @ngInject */
    function ImageDetailBriefCtrl(project) {
        var self = this;
        self.projectInfo = project;
    }
})();