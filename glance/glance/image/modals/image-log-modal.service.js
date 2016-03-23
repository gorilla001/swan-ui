(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageLogModal', imageLogModal);

    /* @ngInject */
    function imageLogModal($uibModal) {

        return {
            open: open
        };

        function open(projectId, buildNumber, imageState) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/image/modals/get-image-log.html',
                controller: ImageLogCtrl,
                controllerAs: 'imageLogCtrl',
                resolve: {
                    content: function () {
                        return {
                            projectId: projectId,
                            buildNumber: buildNumber,
                            imageState: imageState
                        }
                    }
                }
            });

            return modalInstance.result;
        }

        /* @ngInject */
        function ImageLogCtrl($uibModalInstance, content, imageBackend, $rootScope, utils) {
            var self = this;
            var projectId = content.projectId;
            var buildNumber = content.buildNumber;
            var imageState = content.imageState;
            self.log = "";

            self.noLogsFlag = true;

            activate();

            function activate() {
                if (imageState === 'running') {
                    Stream(projectId, buildNumber, function (out) {
                        self.noLogsFlag = false;
                        self.log += out;
                    });
                } else if (imageState !== "running" && imageState !== "pending") {
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
            }

            self.ok = function () {
                $uibModalInstance.close();
            };
            self.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function Stream(projectId, buildNumber, _callback) {
                var callback = _callback;
                var url = utils.buildFullURL('image.streamLog', {
                        project_id: projectId,
                        build_number: buildNumber
                    }) + '?authorization=' +
                    $rootScope.token;

                var events = new EventSource(url);
                events.onmessage = function (event) {
                    if (callback !== undefined) {
                        callback(event.data);
                    }
                };
                events.onerror = function (event) {
                    callback = undefined;
                    if (events !== undefined) {
                        events.close();
                        events = undefined;
                    }
                    console.log('user event stream closed due to error.', event);
                };
            }
        }
    }

})();