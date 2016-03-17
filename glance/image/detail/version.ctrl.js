(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);

    ImageDetailVersionCtrl.$inject = ['imageservice', '$state', 'imageLogModal', '$stateParams', 'imageCurd', '$scope'];

    function ImageDetailVersionCtrl(imageservice, $state, imageLogModal, $stateParams, imageCurd, $scope) {
        var self = this;
        self.IMAGE_STATUS = IMAGE_STATUS;
        self.goToCreateApp = goToCreateApp;

        listImages();

        self.openLogModal = function (imageId) {
            imageLogModal.open($stateParams.projectId, imageId);
        };

        function goToCreateApp(imageUrl) {
            imageCurd.goToCreateApp(imageUrl)
        }

        function listImages() {
            return imageservice.listProjectImages($state.params.projectId, '')
                .then(function (data) {
                    self.projectImages = data;
                });
        }

        $scope.$on('refreshImageData', function(){
            listImages();
        });
    }
})();