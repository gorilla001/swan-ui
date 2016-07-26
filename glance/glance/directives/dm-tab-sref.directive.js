(function () {
    'use strict';
    angular.module('glance')
        .directive('dmTabSref', dmTabSref);

    /* @ngInject */
    function dmTabSref($state, $mdUtil) {
        return {
            require: '^^mdTabs',
            restrict: 'A',
            link: link
        };

        function link(scope, elem, attrs, tabsCtrl) {
            var sref = attrs['dmTabSref'];
            elem.on('click', function () {
                $state.go(sref, null, {reload: true});
            });
            scope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if ($state.includes(sref)) {
                        tabsCtrl.selectedIndex = elem.index();
                    }
                });
        }
    }
})();