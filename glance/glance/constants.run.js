(function () {
    'use strict';
    angular.module('glance.utils')
        .run(Constant);

    /* @ngInject */
    function Constant($rootScope) {
        $rootScope.BACKEND_URL = {
            app: {
                list: '/v_beta/apps',
		show: '/v_beta/apps/$app_id',
		post: '/v_beta/apps',
		delete: '/v_beta/apps/$app_id',
		update: '/v_beta/apps/$app_id',
		scaleup: '/v_beta/apps/$app_id/scale-up',
		scaledown: '/v_beta/apps/$app_id/scale-down',
            },
        };
    }
})();
