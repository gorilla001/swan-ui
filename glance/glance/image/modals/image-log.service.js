(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageLogModal', imageLogModal);

    /* @ngInject */
    function imageLogModal($mdDialog, $base64) {

        return {
            open: open
        };

        function open(ev, projectId, buildNumber) {

            var dialog = $mdDialog.show({
                controller: ImageLogCtrl,
                controllerAs: 'imageLogCtrl',
                templateUrl: '/glance/image/modals/image-log.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    projectId: projectId,
                    buildNumber: buildNumber
                }

            });

            return dialog;
        }

        /* @ngInject */
        function ImageLogCtrl($mdDialog, projectId, buildNumber, imageBackend, $rootScope, utils, $timeout) {
            var self = this;
            
            self.log = "";
            self.ok = function () {
                $mdDialog.hide();
            };
            self.cancel = function () {
                $mdDialog.cancel();
            };
            
            activate();

            function activate() {
                initLog(projectId, buildNumber);
            }
            
            function initLog(projectId, buildNumber) {
                imageBackend.getProjectImage(projectId, buildNumber).then(function (image) {
                    if (image.status === 'running') {
                        Stream(projectId, buildNumber, function (out) {
                            self.log += out;
                        });
                    } else if (image.status === 'pending') {
                        $timeout(function () {
                            initLog(projectId, buildNumber);
                        }, 2000);
                    } else {
                        imageBackend.getImageLog(projectId, buildNumber)
                        .then(function (data) {
                            self.log = data;
                        })
                    }
                })
            }
            function Stream(projectId, buildNumber) {
                var url = utils.buildFullURL('image.streamLog', {
                        project_id: projectId,
                        build_number: buildNumber
                    }) + '?authorization=' +
                    $rootScope.token;

                var events = new EventSource(url);
                events.addEventListener("ci_build_log", function(event) {
                    var msg = event.data;
                    if (msg[0] === '"') {
                        msg = msg.substring(1);
                    }
                    if (msg[msg.length-1] === '"') {
                        msg = msg.substring(0, msg.length-1);
                    }
                    self.log += $base64.decode(msg);
                });
                events.onerror = function (event) {
                    if (events !== undefined) {
                        events.close();
                        events = undefined;
                    }
                    console.log('user event stream closed due to error.', event);
                    $timeout(function () {
                        initLog(projectId, buildNumber);
                    }, 2000);
                };
            }
        }
    }

})();