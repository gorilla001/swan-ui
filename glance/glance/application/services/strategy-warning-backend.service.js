(function () {
    'use strict';
    angular.module('glance.app')
        .factory('appWarningBackend', appWarningBackend);

    /* @ngInject */
    function appWarningBackend(gHttp) {
        //////
        return {
            createWarning: createWarning,
            deleteTask: deleteTask,
            warningList: warningList
        };

        function createWarning(data) {
            return gHttp.Resource('warning.tasks').post(data);
        }

        function deleteTask(taskName) {
            return gHttp.Resource('warning.tasks', {task_name: taskName}).delete();
        }

        function warningList(params) {
            return gHttp.Resource('warning.tasks').get({params : params});
        }
    }
})();