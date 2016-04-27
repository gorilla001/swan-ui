(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('LogWarningListCtrl', LogWarningListCtrl);

    /* @ngInject */
    function LogWarningListCtrl(data, table, $state, $stateParams) {
        var self = this;
        self.logWarningList = data.logs;
        self.searchKeyWord = $stateParams.keywords || '';
        self.logListTable = table.createParams(data.logs, data.Count);
        self.deleteLogPolicy = deleteLogPolicy;
        self.doSearch = doSearch;
        ///

        function deleteLogPolicy(logId) {
            ////
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