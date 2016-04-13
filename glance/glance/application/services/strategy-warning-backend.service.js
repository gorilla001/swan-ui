(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appWarningBackend', appWarningBackend);

    /* @ngInject */
    function appWarningBackend(gHttp) {
        //////
        return {
            createWarning: createWarning,
            deleteTask: deleteTask
        };

        function createWarning(data) {
            gHttp.Resource('warning.tasks').post(data);
        }

        function deleteTask(taskName) {
            gHttp.Resource('warning.tasks', {task_name: taskName}).delete();
        }
    }
})();