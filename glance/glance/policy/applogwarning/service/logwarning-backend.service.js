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
            logPolicyEvents: logPolicyEvents,
            getLogPolicy: getLogPolicy,
            updateLogPolicy: updateLogPolicy,
            stopLogPolicy: stopLogPolicy,
            restartLogPolicy: restartLogPolicy,
            warningLogExtend: warningLogExtend
        };

        function createLogPolicy(data, form){
            return gHttp.Resource('log.logPolicies').post(data, {form: form});
        }

        function deletLogPolicy(logId){
            return gHttp.Resource('log.logPolicy', ({log_id: logId})).delete();
        }

        function logPolicyList(params){
            return gHttp.Resource('log.logPolicies').get({params: params});
        }

        function logPolicyEvents(params){
            return gHttp.Resource('log.logPolicyEvents').get({params: params});
        }

        function getLogPolicy(logId) {
            return gHttp.Resource('log.logPolicy', {log_id: logId}).get();
        }
        
        function updateLogPolicy(data, form) {
            return gHttp.Resource('log.logPolicies').put(data, {form: form});
        }

        function stopLogPolicy(logId) {
            return gHttp.Resource('log.logPolicy', {log_id: logId}).patch({"method":"stop"});
        }
        
        function restartLogPolicy(logId) {
            return gHttp.Resource('log.logPolicy', {log_id: logId}).patch({"method":"restart"});
        }

        function warningLogExtend(params) {
            params.scale_type = 1;
            return gHttp.Resource('app.taskappExtend').get({params: params})
        }
    }
})();