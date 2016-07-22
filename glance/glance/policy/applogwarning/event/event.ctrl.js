(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('EventLogListCtrl', EventLogListCtrl);

    /* @ngInject */
    function EventLogListCtrl(data, mdTable, $state, $stateParams) {
        var self = this;
        
        self.eventLogList = data.events;
        self.count = data.count;
        self.searchKeyWord = $stateParams.keywords || '';
        self.table = mdTable.createTable('policy.tab.applogwarning.logevent');
        self.doSearch = doSearch;
        ///

        function doSearch(searchKeyWord) {
            $state.go('policy.tab.applogwarning.logevent', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }
    }
})();