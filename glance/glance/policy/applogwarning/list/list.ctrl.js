(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('LogWarningListCtrl', LogWarningListCtrl);

    /* @ngInject */
    function LogWarningListCtrl(data, mdTable, $state, $stateParams, logWarningCurd) {
        var self = this;

        self.logWarningList = data.alarms;
        self.searchKeyWord = $stateParams.keywords || '';
        self.table = mdTable.createTable('policy.tab.applogwarning.loglist');
        self.enableText = {
            true: '启动',
            false: '停止'
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

        function switchNotice(logPolicy) {
            logWarningCurd.switchNotice(logPolicy.id, logPolicy.isnotice)
                .then(function (data) {
                    $state.reload();
                });
        }
    }
})();