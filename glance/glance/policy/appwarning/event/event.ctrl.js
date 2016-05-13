(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningEventCtrl', WarningEventCtrl);

    /* @ngInject */
    function WarningEventCtrl(data, mdTable, $stateParams, $state) {
        var self = this;

        self.warningEvents = data.events;
        self.count = data.count;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.table = mdTable.createTable('policy.tab.appwarning.warningevent');
        self.searchKeyWord = $stateParams.keywords || '';

        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.tab.appwarning.warningevent', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();