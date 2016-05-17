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
        }
        
        function link(scope, elem, attrs, tabsCtrl) {
            var sref = attrs['dmTabSref'];
            var index = elem.index();
            console.log(index)
            if (!tabsCtrl.srefs) {
                tabsCtrl.srefs = [];
            }
            tabsCtrl.srefs[index] = sref;
            if ($state.includes(sref)) {
                tabsCtrl.selectedIndex = index;
            }
            if (!tabsCtrl.oldSelect) {
                tabsCtrl.oldSelect = tabsCtrl.select;
            }
            
            tabsCtrl.select = function (index, canSkipClick) {
                var sref = tabsCtrl.srefs[index]
                $state.go(sref, {reload: true});
            }
            
            scope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        if (toState.name === sref) {
                            $mdUtil.nextTick(function () {
                                tabsCtrl.oldSelect(index);
                            });
                        }
                    });
        }
    }
})();