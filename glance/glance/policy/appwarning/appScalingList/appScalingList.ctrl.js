/**
 * Created by geng on 16/5/18.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('WarningAppExtendCtrl', WarningAppExtendCtrl);

    /* @ngInject */
    function WarningAppExtendCtrl(data, mdTable, $stateParams, $state) {
        var self = this;

        self.appExtends = data.ScaleHistory;
        self.count = data.Count;
        self.WARNING_TYPE = WARNING_TYPE;
        self.WARNING_RULE = WARNING_RULE;
        self.table = mdTable.createTable('policy.tab.appwarning.warningappextend');
        self.searchKeyWord = $stateParams.keywords || '';

        self.doSearch = doSearch;
        ////
        function doSearch(searchKeyWord) {
            $state.go('policy.tab.appwarning.warningappextend', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();