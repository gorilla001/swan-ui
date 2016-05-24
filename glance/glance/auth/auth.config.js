(function () {
    'use strict';
    angular.module('glance.auth')
        .config(configure);

    /* ngInject */
    function configure($locationProvider, $interpolateProvider) {

        $locationProvider.html5Mode(true);
        $interpolateProvider.startSymbol('{/');
        $interpolateProvider.endSymbol('/}');
    }
})();