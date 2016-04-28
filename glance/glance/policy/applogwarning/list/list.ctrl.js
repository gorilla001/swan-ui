(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('LogWarningListCtrl', LogWarningListCtrl);

    /* @ngInject */
    function LogWarningListCtrl(data, table, $state, $stateParams, logWarningCurd) {
        var self = this;
        self.logWarningList = data.alarms;
        self.searchKeyWord = $stateParams.keywords || '';
        self.logListTable = table.createParams(data.alarms, data.count);
        self.deleteLogPolicy = deleteLogPolicy;
        self.doSearch = doSearch;
        ///

        function deleteLogPolicy(logId) {
            logWarningCurd.deletLogPolicy(logId)
        }

        function doSearch(searchKeyWord) {
            $state.go('policy.applogwarning.loglist', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }
    }
})();