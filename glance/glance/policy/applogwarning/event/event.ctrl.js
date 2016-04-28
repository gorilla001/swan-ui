(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('EventLogListCtrl', EventLogListCtrl);

    /* @ngInject */
    function EventLogListCtrl(data, table, $state, $stateParams) {
        var self = this;
        self.eventLogList = data.events;
        self.searchKeyWord = $stateParams.keywords || '';
        self.eventLogListTable = table.createParams(data.events, data.count);
        self.doSearch = doSearch;
        ///


        function doSearch(searchKeyWord) {
            $state.go('policy.applogwarning.logevent', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }
    }
})();