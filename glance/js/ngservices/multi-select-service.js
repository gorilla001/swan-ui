/**
 * Created by my9074 on 15/12/25.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('multiSelectConfig', multiSelectConfig);

    multiSelectConfig.$inject = [];

    function multiSelectConfig() {
        return {
            setMultiConfig: setMultiConfig
        };

        function setMultiConfig(selectAllText, selectNoneText, resetText, searchText, nothingSelectedText) {
            var multiConfig = {
                selectAll: selectAllText,
                selectNone: selectNoneText,
                reset: resetText,
                search: searchText,
                nothingSelected: nothingSelectedText
            };

            return multiConfig
        }


    }
})();