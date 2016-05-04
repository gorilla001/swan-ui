(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningListCtrl', WarningListCtrl);

    /* @ngInject */
    function WarningListCtrl(data, table, warningCurd, $state, $stateParams) {
        var self = this;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.warningList = data.tasks;
        self.searchKeyWord = $stateParams.keywords || '';
        self.warningListTable = table.createParams(data.tasks, data.count);
        self.deleteTask = deleteTask;
        self.switchNotice = switchNotice;
        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.appwarning.warninglist', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

        function deleteTask(taskId) {
            warningCurd.deleteTask(taskId)
        }

        function switchNotice(task) {
            warningCurd.switchNotice(task.id, task.enabled)
                .then(function (data) {
                    $state.reload();
                });
        }
    }
})();