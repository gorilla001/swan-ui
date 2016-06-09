(function () {
    'use strict';
    angular.module('glance').config(config);
    
    /* @ngInject */
    function config(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 2000,
            positionX: 'center',
            positionY: 'top',
            replaceMessage: true,
            startTop: 20
        });
    }
})();

