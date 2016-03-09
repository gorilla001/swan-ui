(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['project', 'utils', 'imageCurd', '$stateParams'];

    function ImageDetailCtrl(project, utils, imageCurd, $stateParams) {
        var self = this;
        utils.clickToCopy();

        self.project = project;
        self.deleteProject = deleteProject;

        function deleteProject() {
            imageCurd.deleteProjet($stateParams.projectId)
        }
    }
})();