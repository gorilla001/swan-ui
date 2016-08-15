(function () {
    'use strict';
    angular.module('glance.app')
        .directive('appNameLimit', appNameLimit);

    function appNameLimit() {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModelController) {
                ngModelController.$validators.appNameLimit = function (modelValue, viewValue) {
                    if (ngModelController.$isEmpty(modelValue)) {
                        return true;
                    } else {
                        var count = modelValue.replace(/[^\x00-\xff]/g, "***").length;
                        if (count > 48) {
                            return false;
                        }
                        return true;
                    }

                }
            }
        };
    }
})();
