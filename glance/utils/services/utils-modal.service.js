(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('utilsModal', utilsModal);

    utilsModal.$inject = ['$uibModal'];

    function utilsModal($uibModal) {
        
        return {
            openConfirmModal: openConfirmModal
        }
        
        function openConfirmModal(content) {
            var modalInstance = $uibModal.open({
                templateUrl: '/utils/common_views/confirmModal.html',
                controller: _ConfirmCtrl,
                controllerAs: 'confirmCtrl',
                resolve: {
                    content: function () {return content}
                }
            })
            
            return modalInstance.result;
        }
        
        _ConfirmCtrl.$inject = ['$uibModalInstance', 'content'];
        
        function _ConfirmCtrl($uibModalInstance, content) {
            var self = this;
            self.content = content;
            self.ok = function () {
                $uibModalInstance.close();
            };
            self.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }
    }

})();