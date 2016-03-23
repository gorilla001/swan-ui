/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('createAppPortModal', createAppPortModal);

    createAppPortModal.$inject = ['$uibModal', 'appservice', 'Notification'];

    function createAppPortModal($uibModal, appservice, Notification) {

        CreateAppPortCtrl.$inject = ['$uibModalInstance', 'ports'];

        return {
            open: open
        };

        function open(ports) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/application/createupdate/modals/create-port.html',
                controller: CreateAppPortCtrl,
                controllerAs: 'createAppPortCtrl',
                size: 'lg',
                resolve: {
                    ports: function () {
                        return ports
                    }
                }
            });

            return modalInstance.result;
        }


        function CreateAppPortCtrl($uibModalInstance, ports) {

            var self = this;

            self.portInfo = {
                protocol: 1,
                type: 2,
                isUri: 0,
                uri: ""
            };
            self.innerPorts = ports.innerPorts;
            self.outerPorts = ports.outerPorts;
            self.domains = ports.domains;

            self.invalidPort = invalidPort;
            self.changeProtocol = changeProtocol;
            self.changeType = changeType;
            self.uriOccupied = uriOccupied;
            self.isAddPortDisable = isAddPortDisable;

            self.ok = function () {
                $uibModalInstance.close(self.portInfo)
            };

            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            var pattern = /500[1-9]|50[1-9][0-9]|5100|1[0-9][0-9][0-9][0-9]|20000|31[0-9][0-9][0-9]|32000/;

            function invalidPort() {
                return pattern.test(self.portInfo.mapPort) || portOccupied();
            }

            function portOccupied() {
                if (self.outerPorts.indexOf(self.portInfo.mapPort) != -1) {
                    return true
                } else if (self.innerPorts.indexOf(self.portInfo.mapPort) != -1) {
                    return true
                } else {
                    return false
                }
            }

            function isAddPortDisable() {
                return !(self.portInfo.mapPort)
            }

            function changeProtocol() {
                //Empty the port mapping when change Protocol
                delete  self.portInfo.mapPort;
            }

            function changeType() {
                self.portInfo.uri = "";
                ////
            }

            function uriOccupied() {
                return self.domains.indexOf(self.portInfo.uri) != -1
            }

        }
    }
})();