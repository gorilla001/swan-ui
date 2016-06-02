(function () {
    'use strict';
    angular.module('glance.app')
        .factory('upCanaryModal', upCanaryModal);

    /* @ngInject */
    function upCanaryModal($uibModal) {

        return {
            open: open
        };

        function open(weights) {
            var modalInstance = $uibModal.open({
                templateUrl: '/glance/application/modals/up-canary.html',
                controller: UpCanaryCtrl,
                controllerAs: 'formCtrl',
                resolve: {
                    weights: function () {
                        return weights
                    }
                }
            });

            return modalInstance.result;
        }

        /* @ngInject */
        function UpCanaryCtrl($uibModalInstance, weights) {
            var self = this;

            self.weights = weights;
            self.ok = function () {
                var result = weightFormat(self.weights);

                $uibModalInstance.close(result)
            };
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            function weightFormat(weights){
                var tmp = [];
                tmp = weights.map(function(item, index){
                    var obj = {};
                    obj[item.versionId] = item.weight;
                    return obj
                });

                return tmp

            }
        }
    }
})();