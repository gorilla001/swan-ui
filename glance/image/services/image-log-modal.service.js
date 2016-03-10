(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageLogModal', imageLogModal);

    imageLogModal.$inject = ['$uibModal'];

    function imageLogModal($uibModal) {

        ImageLogCtrl.$inject = ['$uibModalInstance', 'content', 'imageservice'];

        return {
            open: open
        };

        function open(projectId, imageId) {
            var modalInstance = $uibModal.open({
                templateUrl: '/image/modals/get-image-log.html',
                controller: ImageLogCtrl,
                controllerAs: 'imageLogCtrl',
                resolve: {
                    projectId: function () {
                        return projectId
                    },
                    imageId: function(){
                        return imageId
                    }
                }
            });

            return modalInstance.result;
        }


        function ImageLogCtrl($uibModalInstance, projectId, imageId, imageservice) {
            var self = this;
            self.projectId = projectId;
            self.imageId = imageId;

            (function () {
                imageservice.imageLog(self.projectId, self.imageId)
                    .then(function (data) {
                        //start websockt
                    })
            })();


            self.ok = function () {
                $uibModalInstance.close();
            };
            self.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }
    }

})();