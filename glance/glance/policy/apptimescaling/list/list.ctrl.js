(function () {
    'use strict';
    angular.module('glance.policy')
        .controller('ScalingListCtrl', ScalingListCtrl);

    /* @ngInject */
    function ScalingListCtrl(data, table, scaleCurd, $stateParams, $state) {
        var self = this;
        self.dateType = {
            year: '年',
            month: '月',
            week: '周',
            day: '日',
            hour: '小时',
            minute: '分钟'
        };
        self.scaleList = data.Crons;
        self.searchKeyWord = $stateParams.keywords || '';
        self.scaleListTable = table.createParams(data.Crons, data.Count);
        self.deleteScale = deleteScale;
        self.doSearch = doSearch;
        ////

        function deleteScale(scaleId) {
            scaleCurd.deleteScale(scaleId);
        }

        function doSearch(searchKeyWord) {
            $state.go('policy.apptimescaling.scalinglist', {
                page: 1,
                per_page: 20,
                keywords: searchKeyWord
            }, {reload: true});
        }

    }
})();