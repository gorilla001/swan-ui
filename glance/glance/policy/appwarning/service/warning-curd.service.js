/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('warningCurd', warningCurd);


    /* @ngInject */
    function warningCurd(appWarningBackend, confirmModal, $state, Notification) {
        return {
            deleteTask: deleteTask,
            updateTask: updateTask
        };

        function deleteTask(taskId) {
            confirmModal.open('确定删除该应用告警策略吗?').then(function () {
                appWarningBackend.deleteWarning(taskId).then(function (data) {
                    $state.reload();
                });
            })
        }

        function updateTask(data) {
            return appWarningBackend.updateWarning(data);
        }
    }
})();