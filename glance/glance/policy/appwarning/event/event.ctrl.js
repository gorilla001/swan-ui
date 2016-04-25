(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningEventCtrl', WarningEventCtrl);

    /* @ngInject */
    function WarningEventCtrl(data, table, $stateParams, $state) {
        var self = this;
        self.warningEvents = data.events;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.searchKeyWord = $stateParams.keywords || '';
        console.log('searchKeyWord',self.searchKeyWord)
        self.warningEventTable = table.createParams(data.events, data.count);

        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.appwarning.warningevent', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();