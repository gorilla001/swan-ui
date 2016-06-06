(function () {
    'use strict';
    angular.module('glance.user')
        .controller('LicenceDetailCtrl', LicenceDetailCtrl);


    /* @ngInject */
    function LicenceDetailCtrl(alertModal, userBackend, newLicenceModal) {
        var self = this;
        self.licenceInfo = {};
        
        self.openLicenceModal = openLicenceModal;
        self.openApplyModal = openApplyModal;
        
        activate();
        
        function activate() {
            userBackend.getLicenceInfo().then(function(data) {
                self.licenceInfo = data;
            });
        }

        function openLicenceModal(ev) {
            newLicenceModal.open(ev).then(function (data) {
            });
        }

        function openApplyModal(ev) {
            return alertModal.open("", ev, "当前数人云软件未授权，请您联系我们获取授权码:<br>" +
            "电话: +86 10 64776698<br>" +
            "邮箱: info@dataman-inc.com");
        }
    }
})();
