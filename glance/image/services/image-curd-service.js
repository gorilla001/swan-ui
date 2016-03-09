/**
 * Created by my9074 on 16/3/9.
 */
(function () {
    'use strict';
    angular.module('glance.image')
        .factory('imageCurd', imageCurd);

    imageCurd.$inject = ['imageservice', 'confirmModal', 'Notification', '$state'];

    function imageCurd(imageservice, confirmModal, Notification, $state) {
        //////
        return {
            deleteProjet: deleteProjet
        };

        function deleteProjet(projectId) {
            confirmModal.open('确定删除该项目吗?').then(function () {
                imageservice.deleteProject(projectId).then(function (data) {
                    $state.go('imageHome', null, {reload: true});
                }, function (res) {
                    Notification.error('删除失败');
                });
            })
        }
    }
})();