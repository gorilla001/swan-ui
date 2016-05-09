(function () {
    'use strict';
    angular.module('glance.utils')
        .factory('alertModal', alertModal);


    /* @ngInject */
    function alertModal($mdDialog) {
        
        return {
            open: open
        }
        
        function open(content, ev) {
            var dialog = $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .htmlContent("</h3>" + content  + "</h3>")
                      .ok('确定')
                      .targetEvent(ev)
                  );
            return dialog;
        }
       
    }

})();