(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageLogModal', imageLogModal);

    /* @ngInject */
    function imageLogModal($mdDialog) {

        return {
            open: open
        };

        function open(ev, projectId, buildNumber, imageState) {

            var dialog = $mdDialog.show({
                controller: ImageLogCtrl,
                controllerAs: 'imageLogCtrl',
                templateUrl: '/glance/image/modals/get-image-log.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    content: {
                        projectId: projectId,
                        buildNumber: buildNumber,
                        imageState: imageState
                    }
                }

            });

            return dialog;
        }

        /* @ngInject */
        function ImageLogCtrl($mdDialog, content, imageBackend, $rootScope, utils) {
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
                $mdDialog.hide();
            };
            self.cancel = function () {
                $mdDialog.cancel();
            };

            function Stream(projectId, buildNumber, _callback) {
                var callback = _callback;
                var url = utils.buildFullURL('image.streamLog', {
                        project_id: projectId,
                        build_number: buildNumber
                    }) + '?authorization=' +
                    $rootScope.token;

                var events = new EventSource(url);
                events.addEventListener("ci_build_log", function(event) {
                    if (callback !== undefined) {
                        callback(event.data);
                    }
                });
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