/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .factory('newLicenceModal', newLicenceModal);

    /* @ngInject */
    function newLicenceModal($mdDialog, alertModal) {

        return {
            open: open
        };

        function open(ev){
            var dialog = $mdDialog.show({
                controller: InputLicenceCtrl,
                controllerAs: 'inputLicenceCtrl',
                templateUrl: '/glance/user/licence/modals/new-licence.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });

            return dialog;
        }

        /* @ngInject */
        function InputLicenceCtrl($state, $mdDialog, userBackend) {
            var self = this;
            self.licence = '';

            self.ok = function () {
                validate();
                $mdDialog.hide();
            };

            self.cancel = function () {
                $mdDialog.cancel();
            };

            self.openApplyModal = function(ev) {
                alertModal.open("", ev, "当前数人云软件未授权，请您联系我们获取授权码:<br>" +
                    "电话: +86 10 64776698<br>" +
                    "邮箱: info@dataman-inc.com");
                $mdDialog.hide();
            };

            function validate() {
                userBackend.validateLicence(self.licence).then(function(data){
                    $state.reload()
                }, function() {
                    Notification.error('无效的授权码');
                });
            }
        }
    }
})();