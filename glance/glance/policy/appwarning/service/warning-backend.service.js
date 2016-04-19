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
            getWarning: getWarning
        };

        function createWarning(data) {
            return gHttp.Resource('warning.tasks').post(data);
        }

        function deleteWarning(taskId) {
            return gHttp.Resource('warning.task', {task_id: taskId}).delete();
        }

        function warningList(params) {
            return gHttp.Resource('warning.tasks').get({params: params});
        }

        function updateWarning(data) {
            return gHttp.Resource('warning.tasks').put(data);
        }

        function getWarning(taskId) {
            return gHttp.Resource('warning.task', {task_id: taskId}).get();
        }
    }
})();