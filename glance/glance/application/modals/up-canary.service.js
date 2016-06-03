(function () {
    'use strict';
    angular.module('glance.app')
        .factory('upCanaryModal', upCanaryModal);

    /* @ngInject */
    function upCanaryModal($uibModal) {

        return {
            open: open
        };

        function open(canaryObj) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/application/modals/up-canary.html',
                controller: UpCanaryCtrl,
                controllerAs: 'formCtrl',
                resolve: {
                    canaryObj: function () {
                        return canaryObj
                    }
                }
            });

            return modalInstance.result;
        }

        /* @ngInject */
        function UpCanaryCtrl($uibModalInstance, canaryObj) {
            var self = this;

            self.canaryObj = canaryObj;
            self.ok = function () {
                var result = weightFormat(self.canaryObj);

                $uibModalInstance.close(result)
            };
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            function weightFormat(canaryObj){
                var tmp = [];
                tmp = canaryObj.map(function(item, index){
                    var obj = {};
                    obj[item.Vid] = item.weight;
                    return obj
                });

                return tmp

            }
        }
    }
})();