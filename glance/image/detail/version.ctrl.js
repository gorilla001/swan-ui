(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);

    ImageDetailVersionCtrl.$inject = ['imageservice', '$state', 'imageLogModal', '$stateParams'];

    function ImageDetailVersionCtrl(imageservice, $state, imageLogModal, $stateParams) {
        var self = this;

        listImages();

        self.openLogModal = function (imageId) {
            imageLogModal.open($stateParams.projectId, imageId);
        };

        function listImages() {
            return imageservice.listProjectImages($state.params.projectId)
                .then(function (data) {
                    self.projectImages = data;
                });
        }
    }
})();