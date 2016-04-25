/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.policy')
        .factory('scaleCurd', scaleCurd);


    /* @ngInject */
    function scaleCurd(appScalingBackend, $state, Notification, confirmModal) {
        return {
            deleteScale: deleteScale
        };

        function deleteScale(scaleId) {
            confirmModal.open('确定删除该应用扩缩策略吗?').then(function () {
                appScalingBackend.deleteScale(scaleId).then(function (data) {
                    Notification.success('删除成功');
                    $state.reload();
                });
            })
        }
    }
})();