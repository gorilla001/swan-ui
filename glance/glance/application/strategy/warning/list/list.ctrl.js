(function () {
    'use strict';
    angular.module('glance.app')
        .controller('WarningListCtrl', WarningListCtrl);

    /* @ngInject */
    function WarningListCtrl(data, table) {
        var self = this;
        self.warningList = data.List;
        self.warningListTable = table.createParams(data.List, data.Count);
        ////
    }
})();