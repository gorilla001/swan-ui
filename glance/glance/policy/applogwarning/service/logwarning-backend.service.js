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
            restartLogPolicy: restartLogPolicy
        };

        function createLogPolicy(data){
            return gHttp.Resource('log.createLogPolicy').post(data);
        }

        function deletLogPolicy(logId){
            return gHttp.Resource('log.deleteLogPolicy', ({log_id: logId})).delete();
        }

        function logPolicyList(params){
            return gHttp.Resource('log.logPolicys').get({params: params});
        }

        function logPolicyEvents(params){
            return gHttp.Resource('log.logPolicyEvents').get({params: params});
        }

        function getLogPolicy(logId) {
            return gHttp.Resource('log.logPolicy', {log_id: logId}).get();
        }
        
        function updateLogPolicy(data) {
            return gHttp.Resource('log.updateLogPolicy').put(data);
        }

        function stopLogPolicy(logId) {
            return gHttp.Resource('log.stopLogPolicy', {log_id: logId}).put();
        }
        
        function restartLogPolicy(logId) {
            return gHttp.Resource('log.restartLogPolicy', {log_id: logId}).put();
        }
    }
})();