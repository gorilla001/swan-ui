/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('formModal', formModal);

    formModal.$inject = ['$uibModal'];

    function formModal($uibModal) {
        return {
            open: open
        };

        function open(templateUrl, size, dataName) {
            var modalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: FormModalCtrl,
                controllerAs: 'formCtrl',
                size: size,
                resolve: {
                    dataName: function () {
                            if (dataName) {
                                return dataName
                            } else {
                                return 'form'
                            }
                        }
                }
            })
            
            return modalInstance.result;
        }
        
        FormModalCtrl.$inject = ['$uibModalInstance', 'dataName'];
        
        function FormModalCtrl($uibModalInstance, dataName) {
            self = this;
            
            self.ok = function () {
                $uibModalInstance.close(self[dataName]);
            };
            
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        
        }
    }
})();