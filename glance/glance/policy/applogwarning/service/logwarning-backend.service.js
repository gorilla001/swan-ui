(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('logWarningBackend', logWarningBackend);

    /* @ngInject */
    function logWarningBackend(gHttp) {
        //////
        return {
            createLogPolicy: createLogPolicy,
            deletLogPolicy: deletLogPolicy,
            logPolicyList: logPolicyList,
            logPolicyEvents: logPolicyEvents
        };

        function createLogPolicy(data){
            return gHttp.Resource('log.createLogPolicy').post(data);
        }

        function deletLogPolicy(logId){
            return gHttp.Resource('log.logPolicy', ({log_id: logId})).delete();
        }

        function logPolicyList(params){
            return gHttp.Resource('log.logPolicys').get({params: params});
        }

        function logPolicyEvents(params){
            return gHttp.Resource('log.logPolicyEvents').get({params: params});
        }
    }
})();