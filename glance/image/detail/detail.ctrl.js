(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageDetailCtrl', ImageDetailCtrl);

    ImageDetailCtrl.$inject = ['utils'];

    function ImageDetailCtrl(utils) {
        var self = this;
        utils.clickToCopy();
        
    }
})();