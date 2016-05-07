(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);


    /* @ngInject */
    function ImageDetailVersionCtrl(imageBackend, $state, imageLogModal, $stateParams, imageCurd, $scope, mdTable) {
        var self = this;
        self.IMAGE_STATUS = IMAGE_STATUS;
        self.table = mdTable.createTable('image.list.version');
        self.goToCreateApp = goToCreateApp;

        activate();

        self.openLogModal = function (ev, imageId, imageState) {
            imageLogModal.open(ev, $stateParams.projectId, imageId, imageState);
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