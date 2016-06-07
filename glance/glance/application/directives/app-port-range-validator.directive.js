(function () {
    'use strict';
    angular.module('glance.app')
        .directive('appPortVali', appPortVali);

    function appPortVali() {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModelController) {

                function patternInvalid(mapPort) {

                    if (mapPort >= 1 && mapPort <= 1024 && (mapPort != 80 && mapPort != 443)) {
                        return false
                    }

                    if (mapPort >= 5000 && mapPort <= 5100) {
                        return false
                    }

                    if (mapPort >= 10000 &&mapPort <= 20000) {
                        return false
                    }

                    if (mapPort >= 31000 && mapPort <= 32000) {
                        return false
                    }

                    return true
                }

                ngModelController.$validators.appPortVali = function (modelValue, viewValue) {

                    if (ngModelController.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    if (patternInvalid(modelValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    }
})();
