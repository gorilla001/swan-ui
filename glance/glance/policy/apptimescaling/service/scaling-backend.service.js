(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('appScalingBackend', appScalingBackend);

    /* @ngInject */
    function appScalingBackend(gHttp) {
        //////
        return {
            createScaling: createScaling,
            scaleList: scaleList,
            deleteScale: deleteScale
        };

        function createScaling(cid, appId, data) {
            return gHttp.Resource('app.scale', ({cluster_id: cid, app_id: appId})).post(data);
        }

        function scaleList(params) {
            return gHttp.Resource('app.crons').get({params: params});
        }

        function deleteScale(scaleId) {
            return gHttp.Resource('app.cron', ({scale_id: scaleId})).delete();
        }
    }
})();