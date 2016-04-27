/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('logWarningCurd', logWarningCurd);


    /* @ngInject */
    function logWarningCurd(logWarningBackend, $state, Notification, confirmModal) {
        return {
            deletLogPolicy: deletLogPolicy
        };

        function deletLogPolicy(logId){
            confirmModal.open('确定删除该日志告警策略吗?').then(function () {
                logWarningBackend.deletLogPolicy(logId).then(function (data) {
                    Notification.success('删除成功');
                    $state.reload();
                });
            })
        }
    }
})();