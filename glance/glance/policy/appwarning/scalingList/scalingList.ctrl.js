/**
 * Created by geng on 16/5/18.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningScalingCtrl', WarningScalingCtrl);

    /* @ngInject */
    function WarningScalingCtrl(data, mdTable, $stateParams, $state) {
        var self = this;

        self.scalingList = data.ScaleHistory;
        self.count = data.Count;
        self.table = mdTable.createTable('policy.tab.appwarning.warningscaling');
        self.searchKeyWord = $stateParams.keywords || '';

        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.tab.appwarning.warningscaling', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();