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

            function patternInvalid() {

                if (self.portInfo.mapPort >= 1 && self.portInfo.mapPort <= 1024 && (self.portInfo.mapPort != 80 && self.portInfo.mapPort != 443)) {
                    return true
                }

                if (self.portInfo.mapPort >= 5000 && self.portInfo.mapPort <= 5100) {
                    return true
                }

                if (self.portInfo.mapPort >= 10000 && self.portInfo.mapPort <= 20000) {
                    return true
                }

                if (self.portInfo.mapPort >= 31000 && self.portInfo.mapPort <= 32000) {
                    return true
                }

                return false
            }

            function invalidPort() {
                return patternInvalid() || portOccupied();
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