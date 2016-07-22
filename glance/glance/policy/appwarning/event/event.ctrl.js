(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningEventCtrl', WarningEventCtrl);

    /* @ngInject */
    function WarningEventCtrl(data, mdTable, $stateParams, $state) {
        var self = this;

        self.warningEvents = data.events;
        self.count = data.count;
        self.table = mdTable.createTable('policy.tab.appwarning.warningevent');
        self.searchKeyWord = $stateParams.keywords || '';
    }
})();