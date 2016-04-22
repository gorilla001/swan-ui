(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('appScalingBackend', appScalingBackend);

    /* @ngInject */
    function appScalingBackend(gHttp) {
        //////
        return {
            createScaling: createScaling
        };

        function createScaling(cid, appId, data) {
            ////
        }
    }
})();