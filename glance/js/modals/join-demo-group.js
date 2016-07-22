(function () {
    'use strict';
    glanceApp.factory('joinDemoGroupModal', joinDemoGroupModal);

    joinDemoGroupModal.$inject = ['$rootScope', '$uibModal', '$interval', 'Notification'];

    function joinDemoGroupModal($rootScope, $uibModal, $interval, Notification) {
        var phoneCodeResendInterval;
        JoinDemoGroupCtrl.$inject = ['$uibModalInstance', 'gHttp'];

        return {
            open: open
        };

        function open() {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/modals/join-demo-group.html',
                controller: JoinDemoGroupCtrl,
                controllerAs: 'joinDemoGroupCtrl'
            });

            return modalInstance.result;
        }

        function JoinDemoGroupCtrl($uibModalInstance, gHttp) {
            var self = this;
            self.verifyPhoneForm = {
                phone: $rootScope.phoneNumber,
                code: ''
            };

            self.sendButtonText = "发送验证码";
            self.canResendSMS = true;

            if(phoneCodeResendInterval) {
                cancelSMSInterval();
                sendSMSInterval();
            }

            self.ok = function () {
                verifyPhoneCode(self.verifyPhoneForm).then(function() {
                    joinDemoGroup().then(function() {
                        $uibModalInstance.close()
                    });
                });
            };

            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            self.sendSMS = function() {
                sendPhoneCodeSMS({
                    phone: self.verifyPhoneForm.phone
                }).then(function() {

                });
                sendSMSInterval();
            };

            function cancelSMSInterval() {
                $interval.cancel(phoneCodeResendInterval);
                phoneCodeResendInterval = undefined;
            }

            function sendSMSInterval() {
                self.canResendSMS = false;
                self.sendButtonText = "重新发送验证码(" + $rootScope.phoneCodeResendExpire + ")";
                cancelSMSInterval();
                phoneCodeResendInterval = $interval(function () {
                    $rootScope.phoneCodeResendExpire--;
                    if ($rootScope.phoneCodeResendExpire <= 0) {
                        cancelSMSInterval();
                        $rootScope.phoneCodeResendExpire = $rootScope.SMS.phoneCodeResendExpire;
                        self.canResendSMS = true;
                        self.sendButtonText = "发送验证码"
                    } else {
                        self.sendButtonText = "重新发送验证码(" + $rootScope.phoneCodeResendExpire + ")";
                    }
                }, 1000);
            }

            function joinDemoGroup(data) {
                return gHttp.Resource('user.groupDemo').post(data);
            }

            function sendPhoneCodeSMS(data) {
                return gHttp.Resource('auth.phoneCode').post(data);
            }

            function verifyPhoneCode(data) {
                return gHttp.Resource('auth.verifyPhone').post(data);
            }
        }
    }
})();