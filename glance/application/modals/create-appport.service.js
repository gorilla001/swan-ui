/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('createAppPortModal', createAppPortModal);

    createAppPortModal.$inject = ['$uibModal', 'appservice', 'Notification'];

    function createAppPortModal($uibModal, appservice, Notification) {
        return {
            open: open
        };

        function open(ports, proxyNodes, gateWays) {
            var modalInstance = $uibModal.open({
                templateUrl: '/application/modals/create-appport.html',
                controller: _CreateAppPortCtrl,
                controllerAs: 'createAppPortCtrl',
                size: 'lg',
                resolve: {
                    proxyNodes: function () {
                        return proxyNodes
                    },
                    gateWays: function () {
                        return gateWays
                    },
                    ports: function () {
                        return ports
                    }
                }
            })
            
            return modalInstance.result;
        }
        
        _CreateAppPortCtrl.$inject = ['$uibModalInstance', 'instanceNum'];
        
        function _CreateAppPortCtrl($uibModalInstance, proxyNodes, gateWays, ports) {
            
            var INNER = '1';
            var OUTER = '2';
            var SELECT_TCP = '1';
            var SELECT_HTTP = '2';
            var HAS_DOMAIN = '1';
            var NO_DOMAIN = '2';
            
            var self = this;
            
            self.portInfo = {};
            self.proxyNodes = proxyNodes;
            self.gateWays = gateWays;
            self.innerPorts = ports.innerPorts;
            self.outerPorts = ports.outerPorts;
            self.domains = ports.domains;
            self.portInfo.protocol = "1";
            
            if (self.proxyNodes.length) {
                self.portInfo.type = "1"
            } else if (self.gateWays.length) {
                self.portInfo.type = "2"
            }

            self.invalidPort = invalidPort;
            self.changeProtocol = changeProtocol;
            self.changeType = changeType;
            self.isURI = isURI;
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
            };
            
            function portOccupied() {
                if (self.portInfo.type === OUTER && self.portInfo.isUri != HAS_DOMAIN && self.outerPorts.indexOf(self.portInfo.mapPort) != -1) {
                    return true
                } else if (self.portInfo.type === INNER && self.innerPorts.indexOf(self.portInfo.mapPort) != -1) {
                    return true
                } else {
                    return false
                }
            };
            
            function changeProtocol() {
                //Empty the port mapping when change Protocol
                delete  self.portInfo.mapPort;
                if (self.portInfo.protocol === SELECT_HTTP && self.portInfo.type === OUTER) {
                    self.portInfo.isUri = HAS_DOMAIN;
                    self.portInfo.mapPort = 80;
                }

                if (self.portInfo.protocol === SELECT_TCP) {
                    if (self.portInfo.hasOwnProperty('uri')) {
                        delete self.portInfo.uri
                    }
                    if (self.portInfo.hasOwnProperty('isUri')) {
                        delete self.portInfo.isUri;
                    }
                }
            };
            
            function changeType() {
                self.portInfo.uri = "";
                if (self.portInfo.type === OUTER && self.portInfo.protocol === SELECT_HTTP) {
                    self.portInfo.isUri = HAS_DOMAIN;
                    self.portInfo.mapPort = 80;
                } else {
                    self.portInfo.mapPort = "";
                    if (self.portInfo.hasOwnProperty('uri')) {
                        delete self.portInfo.uri
                    }
                    if (self.portInfo.hasOwnProperty('isUri')) {
                        delete self.portInfo.isUri;
                    }
                }
            };
            
            function isURI() {
                if (self.portInfo.isUri === HAS_DOMAIN) {
                    self.portInfo.mapPort = 80;
                } else if (self.portInfo.isUri === NO_DOMAIN) {
                    self.portInfo.mapPort = "";
                    if (self.portInfo.hasOwnProperty('uri')) {
                        delete self.portInfo.uri
                    }
                }
            };
            
            function uriOccupied() {
                return self.domains.indexOf(self.portInfo.uri) != -1
            };
            
            function isAddPortDisable() {
                if (!self.portInfo.appPort || !self.portInfo.protocol || !self.portInfo.type || self.portInfo.protocol === '' || self.portInfo.type === '') {
                    return true;
                }

                if ((self.portInfo.type === OUTER && self.portInfo.isUri != HAS_DOMAIN && self.gateWays.length == 0) || (self.portInfo.type === INNER && self.proxyNodes.length == 0)) {
                    return true;
                }

                if (self.portInfo.type === INNER && self.portInfo.mapPort) {
                    return false;
                } else if (self.portInfo.type === OUTER && self.portInfo.isUri === HAS_DOMAIN && self.portInfo.uri) {
                    return false
                } else if (self.portInfo.type === OUTER && self.portInfo.isUri === NO_DOMAIN && self.portInfo.mapPort) {
                    return false;
                } else if (self.portInfo.protocol === SELECT_TCP && (self.portInfo.type && self.portInfo.type !== '') && self.portInfo.mapPort) {
                    return false;
                } else {
                    return true;
                }
            };
        
        }
    }
})();