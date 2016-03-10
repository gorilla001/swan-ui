(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailVersionCtrl', ImageDetailVersionCtrl);

    ImageDetailVersionCtrl.$inject = ['imageservice', '$state', 'imageLogModal', '$stateParams'];

    function ImageDetailVersionCtrl(imageservice, $state, imageLogModal, $stateParams) {
        var self = this;
        

        listPageImages();

        self.pagination = {
            showPagination: false,
            totalItems: undefined,
            currentPage: 1,
            itemPerPage: 10,
            maxSize: 5
        };

        self.pageChange = pageChange;
        self.openLogModal = openLogModal;

        function openLogModal(imageId){
            imageLogModal.open($stateParams.projectId, imageId);
        }

        function pageChange() {
            listPageImages(self.pagination.currentPage, self.pagination.itemPerPage);
        }

        function listPageImages(page, itemPerPage) {
            return imageservice.listProjectImages($state.params.projectId, page, itemPerPage)
                .then(function(data) {
                    self.projectImages = data.images;
                    self.pagination.totalItems = data.total;
                    self.pagination.showPagination = Boolean(self.pagination.totalItems > self.pagination.itemPerPage);
                });
        }
    }
})();