(function () {
    'use strict';
    angular.module('glance.app')
        .factory('upCanaryModal', upCanaryModal);

    /* @ngInject */
    function upCanaryModal($mdDialog) {

        return {
            open: open
        };

        function open(ev, canaryObj) {
            var dialog = $mdDialog.show({
                templateUrl: '/glance/application/modals/up-canary.html',
                controller: UpCanaryCtrl,
                controllerAs: 'formCtrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                targetEvent: ev,
                locals: {canaryObj: canaryObj}
            });

            return dialog;
        }

        /* @ngInject */
        function UpCanaryCtrl($mdDialog, canaryObj) {
            var self = this;

            self.canaryObj = canaryObj.map(function(item, index){
                var tmp = {
                    Vid: item.Vid,
                    Weight: item.Weight
                };

                return tmp
            });

            self.ok = function () {
                var result = weightFormat(self.canaryObj);
                $mdDialog.hide(result);
            };
            self.cancel = function () {
                $mdDialog.cancel();
            };

            function weightFormat(canaryObj) {
                var tmp = {};
                var lenght = canaryObj.length;

                for (var index = 0; index < lenght; index++) {
                    tmp[canaryObj[index].Vid] = canaryObj[index].Weight;
                }

                return tmp

            }
        }
    }
})();