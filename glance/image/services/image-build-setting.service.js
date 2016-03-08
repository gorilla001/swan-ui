(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageBuildSetting', imageBuildSetting);

    imageBuildSetting.$inject = [];

    function imageBuildSetting() {
        //////
        return {
            triggerCheck: triggerCheck,
            triggerRules: triggerRules
        };

        function triggerCheck(checkValue, triggerCount) {
            if (checkValue) {
                triggerCount++;
            } else {
                triggerCount--;
            }

            return triggerCount
        }

        function triggerRules(tagValue, branchValue) {
            if (tagValue && branchValue) {
                return IMAGE_TRIGGER_TYPE.SELECT_ALL
            } else if (tagValue) {
                return IMAGE_TRIGGER_TYPE.SELECT_TAG
            } else if (branchValue) {
                return IMAGE_TRIGGER_TYPE.SELECT_BRANCH
            }
        }
    }
})();