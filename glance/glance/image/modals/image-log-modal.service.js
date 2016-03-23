(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageLogModal', imageLogModal);

    imageLogModal.$inject = ['$uibModal'];

    function imageLogModal($uibModal) {

        ImageLogCtrl.$inject = ['$uibModalInstance', 'content', 'imageBackend'];

        return {
            open: open
        };

        function open(projectId, buildNumber) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/image/modals/get-image-log.html',
                controller: ImageLogCtrl,
                controllerAs: 'imageLogCtrl',
                resolve: {
                    content: function () {
                        return {
                            projectId: projectId,
                            buildNumber: buildNumber
                        }
                    }
                }
            });

            return modalInstance.result;
        }


        function ImageLogCtrl($uibModalInstance, content, imageBackend) {
            var self = this;
            var projectId = content.projectId;
            var buildNumber = content.buildNumber;

            self.noLogsFlag = true;

            activate();

            function activate() {
                imageBackend.getImageLog(projectId, buildNumber)
                    .then(function (data) {
                        self.log = data;
                        if (self.log) {
                            self.noLogsFlag = false
                        }
                    }, function (res) {
                        self.noLogsFlag = true
                    })
            }

            self.ok = function () {
                $uibModalInstance.close();
            };
            self.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }
    }

})();