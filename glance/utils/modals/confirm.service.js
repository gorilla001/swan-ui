(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('confirmModal', confirmModal);

    confirmModal.$inject = ['$uibModal'];

    function confirmModal($uibModal) {
        
        ConfirmCtrl.$inject = ['$uibModalInstance', 'content'];
        
        return {
            open: open
        }
        
        function open(content) {
            var modalInstance = $uibModal.open({
                templateUrl: '/utils/modals/confirm.html',
                controller: ConfirmCtrl,
                controllerAs: 'confirmCtrl',
                resolve: {
                    content: function () {return content}
                }
            })
            
            return modalInstance.result;
        }
        
        
        function ConfirmCtrl($uibModalInstance, content) {
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