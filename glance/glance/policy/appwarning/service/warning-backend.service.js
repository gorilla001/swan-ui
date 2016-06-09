(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('appWarningBackend', appWarningBackend);

    /* @ngInject */
    function appWarningBackend(gHttp) {
        //////
        return {
            createWarning: createWarning,
            deleteWarning: deleteWarning,
            warningList: warningList,
            updateWarning: updateWarning,
            getWarning: getWarning,
            warningEvent: warningEvent,
            patchWarning: patchWarning,
            warningAppExtend: warningAppExtend
        };

        function createWarning(data, form) {
            return gHttp.Resource('warning.tasks').post(data, {form: form});
        }

        function deleteWarning(taskId) {
            return gHttp.Resource('warning.task', {task_id: taskId}).delete();
        }

        function warningList(params) {
            return gHttp.Resource('warning.tasks').get({params: params});
        }

        function updateWarning(data, form) {
            return gHttp.Resource('warning.tasks').put(data, {form: form});
        }

        function patchWarning(taskId, method) {
            return gHttp.Resource('warning.task', {task_id: taskId}).patch({method: method});
        }

        function getWarning(taskId) {
            return gHttp.Resource('warning.task', {task_id: taskId}).get();
        }

        function warningEvent(params) {
            return gHttp.Resource('warning.tasksEvent').get({params: params});
        }
        
        function warningAppExtend(params) {
            params.scale_type = 0;
            return gHttp.Resource('app.taskappExtend').get({params: params})
        }
    }
})();