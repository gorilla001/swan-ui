(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);

    ImageDetailVersionCtrl.$inject = ['imageservice', '$state', 'imageLogModal', '$stateParams', '$filter'];

    function ImageDetailVersionCtrl(imageservice, $state, imageLogModal, $stateParams, $filter) {
        var self = this;
        self.IMAGE_STATUS = IMAGE_STATUS;
        self.goToCreateApp = goToCreateApp;

        listImages();

        self.openLogModal = function (imageId) {
            imageLogModal.open($stateParams.projectId, imageId);
        };

        function goToCreateApp(imageUrl){
            var url = $filter("filterVersion")(imageUrl, 'url');
            var version = $filter("filterVersion")(imageUrl, 'version');
            $state.go('appcreate',{url: url, version: version})
        }

        function listImages() {
            return imageservice.listProjectImages($state.params.projectId)
                .then(function (data) {
                    self.projectImages = data;
                });
        }
    }
})();