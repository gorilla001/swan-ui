/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appModal', appModal);

    appModal.$inject = ['$uibModal', 'appcurd'];

    function appModal($uibModal, appcurd) {
        return {
            openUpContainerModal: openUpContainerModal
        };

        function openUpContainerModal(instanceNum, clusterId, appId) {
            var modalInstance = $uibModal.open({
                templateUrl: '/application/common_app_views/upContainerModal.html',
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