(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('LogWarningListCtrl', LogWarningListCtrl);

    /* @ngInject */
    function LogWarningListCtrl(data, mdTable, $state, $stateParams, logWarningCurd) {
        var self = this;

        self.WARNING_LEVEL = WARNING_LEVEL;
        self.logWarningList = data.alarms;
        self.searchKeyWord = $stateParams.keywords || '';
        self.table = mdTable.createTable('policy.tab.applogwarning.loglist');
        self.enableText = {
            0: '停止',
            1: '启动',
            2: '不可用'
        };

        self.deleteLogPolicy = deleteLogPolicy;
        self.doSearch = doSearch;
        self.switchNotice = switchNotice;
        ///

        function deleteLogPolicy(logId, ev) {
            logWarningCurd.deletLogPolicy(logId, ev)
        }

        function doSearch(searchKeyWord) {
            $state.go('policy.tab.applogwarning.loglist', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

        function switchNotice(logId, isnotice) {
            logWarningCurd.switchNotice(logId, isnotice)
                .then(function (data) {
                    $state.reload();
                });
        }
    }
})();