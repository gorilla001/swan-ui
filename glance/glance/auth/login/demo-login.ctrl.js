(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('DemoLoginCtrl', DemoLoginCtrl);

    /* @ngInject */
    function DemoLoginCtrl($state, $stateParams, $scope, authCurd, commonBackend) {
        
        activate();

        function activate() {
            authCurd.login({'email': DEMO_EMAIL});
        };
    }
})();