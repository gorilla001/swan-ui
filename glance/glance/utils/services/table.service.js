(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('table', table);

    /* @ngInject */
    function table($state, $stateParams, ngTableParams) {
        return {
            createParams: createParams
        };
        
        function encodeTableParams() {
            var tableParams = {
                    page: $stateParams.page,
                    count: $stateParams.per_page
                    }
            if ($stateParams.sort_by) {
                tableParams.sorting = {};
                tableParams.sorting[$stateParams.sort_by] = $stateParams.order;
            }
            return tableParams;
        };
        
        function decodeTableParams(tableParams) {
            var params = {
                page: tableParams.page(),
                per_page: tableParams.count(),
            };
            angular.forEach(tableParams.sorting(), function(order, sort_by) {
                params.sort_by = sort_by;
                params.order = order;
            })
            return params;
        }
        
        function createParams(data, total) {
            if (!data.length && $stateParams.page > 1) {
                $stateParams.page = $stateParams.page - 1;
                $state.go($state.current, $stateParams, {reload: true})
            }
            var isFirst = true;
            var tableParams = new ngTableParams(encodeTableParams(), {
                    counts: [20, 50, 100], // custom page count
                    paginationMaxBlocks: 13,
                    paginationMinBlocks: 2,
                    getData: function ($defer, params) {
                        if (!isFirst) {
                            $state.go($state.current, decodeTableParams(params), {reload: true});
                        } else {
                            $defer.resolve(data);
                            isFirst = false;
                        }
                    }
                });
            tableParams.total(total);
            return tableParams
        }

    }

})();