(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['utils', '$state', 'imageservice'];

    function ImageDetailCtrl(utils, $state, imageservice) {
        var self = this;
        utils.clickToCopy();

        function getProject() {
            return imageservice.getProject($state.params.projectId)
                .then(function(project) {
                    self.project = project;
                });
        }
        getProject();

        
    }
})();