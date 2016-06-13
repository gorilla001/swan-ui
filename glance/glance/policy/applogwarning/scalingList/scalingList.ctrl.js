/**
 * Created by geng on 16/5/18.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarnLogScalingCtrl', WarnLogScalingCtrl);

    /* @ngInject */
    function WarnLogScalingCtrl(data, mdTable, $stateParams, $state) {
        var self = this;

        self.scalingList = data.ScaleHistory;
        self.count = data.Count;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.table = mdTable.createTable('policy.tab.appwarning.logscaling');
        self.searchKeyWord = $stateParams.keywords || '';

        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.tab.appwarning.logscaling', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();