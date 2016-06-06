/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('warningCurd', warningCurd);


    /* @ngInject */
    function warningCurd(appWarningBackend, confirmModal, $state) {
        return {
            deleteTask: deleteTask,
            updateTask: updateTask,
            switchNotice: switchNotice
        };

        function deleteTask(taskId, ev) {
            confirmModal.open('确定删除该应用告警策略吗?', ev).then(function () {
                appWarningBackend.deleteWarning(taskId).then(function (data) {
                    $state.reload();
                });
            })
        }

        function updateTask(data, form) {
            return appWarningBackend.updateWarning(data, form);
        }
        
        function switchNotice(taskId, enable) {
            var method;
            if (enable) {
                method = "enable";
            } else {
                method = "disable";
            }
            return appWarningBackend.patchWarning(taskId, method);
        }
    }
})();