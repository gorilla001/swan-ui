(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);

    ImageDetailVersionCtrl.$inject = ['imageBackend', '$state', 'imageLogModal', '$stateParams', 'imageCurd', '$scope'];

    function ImageDetailVersionCtrl(imageBackend, $state, imageLogModal, $stateParams, imageCurd, $scope) {
        var self = this;
        self.IMAGE_STATUS = IMAGE_STATUS;
        self.goToCreateApp = goToCreateApp;

        $scope.$parent.activeTab = 'version';

        activate();

        self.openLogModal = function (imageId) {
            imageLogModal.open($stateParams.projectId, imageId);
        };

        function activate() {
            listImages();
        }

        function goToCreateApp(imageUrl) {
            imageCurd.goToCreateApp(imageUrl)
        }

        function listImages() {
            return imageBackend.listProjectImages($state.params.projectId, '')
                .then(function (data) {
                    self.projectImages = data;
                });
        }

        $scope.$on('refreshImageData', function () {
            listImages();
        });
    }
})();