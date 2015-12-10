(function () {
    'use strict';
    angular.module('glance')
        .factory('labelDataService', labelDataService);

    labelDataService.$inject = ['glanceHttp'];

    function labelDataService(glanceHttp) {
        return {
            listAllLabels: listAllLabels
        };

        function listAllLabels() {
            return glanceHttp.ajaxGet(['cluster.label']);
        }
    }
})();