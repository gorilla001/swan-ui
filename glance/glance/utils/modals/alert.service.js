(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('alertModal', alertModal);

    alertModal.$inject = ['$uibModal'];

    function alertModal($uibModal) {
        
        AlertCtrl.$inject = ['$uibModalInstance', 'content'];
        
        return {
            open: open
        }
        
        function open(content) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/utils/modals/alert.html',
                controller: AlertCtrl,
                controllerAs: 'alertCtrl',
                resolve: {
                    content: function () {return content}
                }
            })
            return modalInstance.result;
        }
        
        
        function AlertCtrl($uibModalInstance, content) {
            var self = this;
            self.content = content;
            self.close = function () {
                $uibModalInstance.close();
            };
        }
    }

})();