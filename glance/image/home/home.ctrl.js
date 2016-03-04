(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageHomeCtrl', ImageHomeCtrl);

    ImageHomeCtrl.$inject = ['$rootScope'];

    function ImageHomeCtrl($rootScope) {
        var self = this;
        
        $rootScope.show = 'image';
        ///
    }
})();