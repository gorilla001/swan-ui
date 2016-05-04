(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('confirmModal', confirmModal);

    /* @ngInject */
    function confirmModal($mdDialog) {
        
        return {
            open: open
        }
        
        function open(content, ev) {
            var confirm = $mdDialog.confirm()
            .clickOutsideToClose(true)
            .textContent(content)
            .targetEvent(ev)
            .ok('确定')
            .cancel('取消');
             var dialog = $mdDialog.show(confirm);
            return dialog
        }
    }

})();