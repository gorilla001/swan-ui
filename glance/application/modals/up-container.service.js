/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('upContainerModal', upContainerModal);

    upContainerModal.$inject = ['$uibModal', 'appcurd'];

    function upContainerModal($uibModal, appcurd) {
        return {
            open: open
        };

        function open(instanceNum, clusterId, appId) {
            var modalInstance = $uibModal.open({
                templateUrl: '/application/modals/up-container.html',
                controller: _UpContainerCtrl,
                controllerAs: 'upContainerCtrl',
                resolve: {
                    instanceNum: function () {return instanceNum},
                    clusterId: function () {return clusterId},
                    appId: function () {return appId}
                }
            })
            
            return modalInstance.result;
        }
        
        _UpContainerCtrl.$inject = ['$uibModalInstance', 'instanceNum', 'clusterId', 'appId'];
        
        function _UpContainerCtrl($uibModalInstance, instanceNum, clusterId, appId) {
            var self = this;
            self.instanceNum = instanceNum;
            self.updateContainer = function () {
                appcurd.updateContainer({instances: self.instanceNum}, clusterId, appId).then(function () {
                });
                $uibModalInstance.close();
            };
            
            self.cancel = function () {
                $uibModalInstance.close();
            }
            
        }
    }
})();