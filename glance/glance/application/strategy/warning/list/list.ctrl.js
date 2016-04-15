(function () {
    'use strict';
    angular.module('glance.app')
        .controller('WarningListCtrl', WarningListCtrl);

    /* @ngInject */
    function WarningListCtrl(data, table, warningCurd, $state) {
        var self = this;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.warningList = data.tasks;
        self.warningListTable = table.createParams(data.tasks, data.count);
        self.deleteTask = deleteTask;
        self.switchNotice = switchNotice;
        ////

        function deleteTask(taskId) {
            warningCurd.deleteTask(taskId)
        }

        function switchNotice(itemInfo) {
            warningCurd.updateTask(itemInfo)
                .then(function (data) {
                    $state.reload();
                });
        }
    }
})();