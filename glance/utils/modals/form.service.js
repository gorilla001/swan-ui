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

        //options: size,dataName,initData,ctrlName
        function open(templateUrl, options) {
            if (!options) {
                options = {};
            }
            if (!options.dataName) {
                options.dataName = 'form';
            }
            if (!options.ctrlName) {
                options.ctrlName = 'formCtrl';
            }
            var modalInstance = $uibModal.open({
                templateUrl: templateUrl,
                controller: FormModalCtrl,
                controllerAs: options.ctrlName,
                size: options.size,
                resolve: {
                    dataName: function () {
                        return options.dataName
                    },
                    initData: function () {
                        return options.initData
                    }
                }
            })
            
            return modalInstance.result;
        }
        
        FormModalCtrl.$inject = ['$uibModalInstance', 'dataName', 'initData'];
        
        function FormModalCtrl($uibModalInstance, dataName, initData) {
            self = this;
            self[dataName] = initData;
            
            self.ok = function () {
                $uibModalInstance.close(self[dataName]);
            };
            
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        
        }
    }
})();