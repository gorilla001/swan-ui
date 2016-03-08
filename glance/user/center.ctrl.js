(function () {
    'use strict';
    angular.module('glance.user')
        .controller('UserCenterCtrl', UserCenterCtrl);

    UserCenterCtrl.$inject = [
        '$rootScope',
    ];

    function UserCenterCtrl(
        $rootScope
    ) {
        $rootScope.show = "";
    }
})();
