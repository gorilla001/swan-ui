(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningListCtrl', WarningListCtrl);

    /* @ngInject */
    function WarningListCtrl(data, warningCurd, $state, $stateParams, mdTable) {
        var self = this;

        self.warningList = data.tasks;
        self.count = data.count;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.WARNING_LEVEL = WARNING_LEVEL;
        self.table = mdTable.createTable('policy.tab.appwarning.warninglist');
        self.enableText = {
            0: '停止',
            1: '启动',
            2: '不可用'
        };
        self.searchKeyWord = $stateParams.keywords || '';

        self.deleteTask = deleteTask;
        self.switchNotice = switchNotice;
        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.tab.appwarning.warninglist', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

        function deleteTask(taskId, ev) {
            warningCurd.deleteTask(taskId, ev)
        }

        function switchNotice(task) {
            warningCurd.switchNotice(task.id, !task.enabled)
                .then(function (data) {
                    $state.reload();
                });
        }
    }
})();