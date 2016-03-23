/**
 * Created by my9074 on 16/3/11.
 */
(function () {
    'use strict';
    angular.module('glance.image')
        .filter('filterVersion', filterVersion);

    filterVersion.$inject = [];

    function filterVersion() {
        //////
        return function (input, filterVersion) {
            input = input || '';
            // conditional based on optional argument
            var index = input.lastIndexOf(':');
            if (filterVersion === 'version') {
                if (index != -1) {
                    input = input.slice(index + 1)
                } else {
                    input = ""
                }
            } else if (filterVersion === 'url') {
                if (index != -1) {
                    input = input.slice(0, index)
                }
            }

            return input;
        }
    }
})();