(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['project', 'utils', 'imageCurd', '$stateParams'];

    function ImageDetailCtrl(project, utils, imageCurd, $stateParams) {
        var self = this;
        utils.clickToCopy();

        self.project = project;
        self.projectVersion = spliceVersion(project.repoUri);
        self.deleteProject = deleteProject;

        function deleteProject() {
            imageCurd.deleteProjet($stateParams.projectId)
        }

        function spliceVersion(url) {
            var index = url.lastIndexOf(':');
            if (index != -1) {
                url = url.slice(index + 1)
            } else {
                url = "latest"
            }
            return url
        }
    }
})();