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
        self.WARNING_LEVEL = WARNING_LEVEL;
        self.table = mdTable.createTable('policy.tab.appwarning.warningevent');
        self.searchKeyWord = $stateParams.keywords || '';
    }
})();