/**
 * Created by my9074 on 16/6/20.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('repeatModal', repeatModal);

    /* @ngInject */
    function repeatModal($mdDialog) {

        return {
            open: open
        };

        function open(ev) {

            var dialog = $mdDialog.show({
                controller: RepeatModalCtrl,
                controllerAs: 'repeatModalCtrl',
                templateUrl: '/glance/policy/common/modal/repeat-alert.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
            return dialog;
        }

        /* @ngInject */
        function RepeatModalCtrl($mdDialog) {
            var self = this;

            self.ok = function () {
                $mdDialog.hide();
            };

            self.cancel = function () {
                $mdDialog.cancel();
            };

        }
    }
})();